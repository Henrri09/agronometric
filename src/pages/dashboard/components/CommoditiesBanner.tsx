import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef, useCallback } from "react";
import "../../../styles/commodities.css";

type Commodity = {
    id: string;
    name: string;
    commodity_prices: CommodityPrice[];
}

type CommodityPrice = {
    id: string;
    close_date: string;
    price: number;
    commodity_id: string;
}

export function CommoditiesBanner() {
    const tickerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const getCommodities = async () => {
        try {
            const res = await fetch('http://localhost:3002/commodities');
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar commodities:', error);
            return [];
        }
    }

    const { data: commodities = [] } = useQuery({
        queryKey: ['commodities'],
        queryFn: getCommodities,
    });

    // Calcula a variação (%) em relação ao preço anterior
    const calculatePriceVariation = (prices: CommodityPrice[]) => {
        if (!prices || prices.length < 2) return 0;

        const sortedPrices = [...prices].sort((a, b) =>
            new Date(a.close_date).getTime() - new Date(b.close_date).getTime()
        );

        const latestPrice = sortedPrices[sortedPrices.length - 1].price;
        const previousPrice = sortedPrices[sortedPrices.length - 2].price;

        return ((latestPrice - previousPrice) / previousPrice) * 100;
    };

    // Função para iniciar a animação do ticker
    const startTickerAnimation = useCallback(() => {
        if (!tickerRef.current || !contentRef.current || commodities.length === 0) return;

        const tickerElement = tickerRef.current;
        const tickerContent = contentRef.current;

        // Limpar o conteúdo existente para evitar duplicações indesejadas
        while (tickerContent.childNodes.length > commodities.length) {
            tickerContent.removeChild(tickerContent.lastChild as Node);
        }

        // Clone os nós originais para garantir que todos os eventos e propriedades sejam preservados
        const tickerItems = tickerContent.querySelectorAll('.ticker-item');

        // Cria cópias dos itens para garantir um loop contínuo
        // Precisamos de cópias suficientes para preencher pelo menos duas vezes a largura do container
        const numberOfCopies = Math.ceil(tickerElement.clientWidth / tickerContent.clientWidth) + 1;

        for (let i = 0; i < numberOfCopies; i++) {
            tickerItems.forEach(item => {
                const clone = item.cloneNode(true) as HTMLElement;
                clone.style.animationDelay = `${i * 0.1}s`; // Pequeno delay para evitar saltos visíveis
                tickerContent.appendChild(clone);
            });
        }

        // Calcula a largura total do conteúdo
        const originalItemsWidth = Array.from(tickerItems).reduce((acc, item) => acc + item.clientWidth, 0);

        // Reset a animação
        tickerContent.style.animation = 'none';
        void tickerContent.offsetHeight; // Força um reflow

        // Ajusta a duração da animação baseada na largura total dos itens e no número de itens
        const speed = 60; // Velocidade em pixels por segundo
        const duration = Math.max(originalItemsWidth / speed, 15); // Pelo menos 15 segundos

        // Aplica a animação
        tickerContent.style.animation = `ticker ${duration}s linear infinite`;
    }, [commodities]);

    // Inicializa e gerencia a animação
    useEffect(() => {
        if (isAnimating || commodities.length === 0) return;

        setIsAnimating(true);

        // Inicia a animação após o conteúdo ser renderizado
        setTimeout(() => startTickerAnimation(), 100);

        // Gerencia redimensionamento da janela
        const handleResize = () => {
            // Reinicia a animação quando o tamanho da janela muda
            startTickerAnimation();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [commodities, isAnimating, startTickerAnimation]);

    // Gerencia pausas na animação
    useEffect(() => {
        if (!tickerRef.current || !contentRef.current) return;

        const tickerElement = tickerRef.current;
        const tickerContent = contentRef.current;

        // Funções para pausar e continuar a animação
        const pauseAnimation = () => {
            if (tickerContent) tickerContent.style.animationPlayState = 'paused';
        };

        const resumeAnimation = () => {
            if (tickerContent) tickerContent.style.animationPlayState = 'running';
        };

        // Pausa a animação quando o mouse está sobre o ticker
        tickerElement.addEventListener('mouseenter', pauseAnimation);
        tickerElement.addEventListener('mouseleave', resumeAnimation);

        return () => {
            tickerElement.removeEventListener('mouseenter', pauseAnimation);
            tickerElement.removeEventListener('mouseleave', resumeAnimation);
        };
    }, [commodities]);

    // Renderiza um item do ticker
    const renderTickerItem = (commodity: Commodity) => {
        // Pega o preço mais recente
        const sortedPrices = [...commodity.commodity_prices || []].sort(
            (a, b) => new Date(b.close_date).getTime() - new Date(a.close_date).getTime()
        );

        const latestPrice = sortedPrices.length > 0 ? sortedPrices[0].price : 0;
        const variation = calculatePriceVariation(commodity.commodity_prices);
        const isPositive = variation >= 0;

        return (
            <div key={commodity.id} className="ticker-item">
                <span className="ticker-symbol">{commodity.name}</span>
                <span className="ticker-price">R${latestPrice.toFixed(2)}</span>
                <span className={`ticker-variation ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '+' : ''}{variation.toFixed(2)}%
                </span>
            </div>
        );
    };

    if (commodities.length === 0) {
        return <div className="ticker-container">Carregando commodities...</div>;
    }

    return (
        <div className="ticker-container" ref={tickerRef}>
            <div className="ticker-content" ref={contentRef}>
                {commodities.map(renderTickerItem)}
            </div>
        </div>
    );
}