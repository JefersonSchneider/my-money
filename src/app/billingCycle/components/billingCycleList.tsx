"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type BillingCycle = {
    id: number;
    name: string;
    month: number;
    year: number;
    createdAt: string;
    updatedAt: string;
    credits?: Array<{
        id: number;
        name: string;
        value: number;
    }>;
    debts?: Array<{
        id: number;
        name: string;
        value: number;
        status: "PAGO" | "PENDENTE" | "AGENDADO";
    }>;
};

const BillingCycleList = () => {
    const [billingCycles, setBillingCycles] = useState<BillingCycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        axios.get('/api/billingCycle')
            .then(res => {
                if (cancelled) return;
                setBillingCycles(res.data ?? []);
                setLoading(false);
            })
            .catch(err => {
                if (cancelled) return;
                setError('Erro ao carregar os ciclos de pagamento');
                setLoading(false);
                console.error('Erro ao buscar billing cycles:', err);
            });

        return () => { cancelled = true; };
    }, []);

    const getMonthName = (month: number): string => {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return months[month - 1] || '';
    };

    if (loading) {
        return (
            <div>
                <p>Carregando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Mês</th>
                        <th>Ano</th>
                    </tr>
                </thead>
                <tbody>
                    {billingCycles.length === 0 ? (
                        <tr>
                            <td colSpan={3} style={{ textAlign: 'center' }}>
                                Nenhum ciclo de pagamento encontrado
                            </td>
                        </tr>
                    ) : (
                        billingCycles.map(bc => (
                            <tr key={bc.id}>
                                <td>{bc.name}</td>
                                <td>{getMonthName(bc.month)}</td>
                                <td>{bc.year}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BillingCycleList;