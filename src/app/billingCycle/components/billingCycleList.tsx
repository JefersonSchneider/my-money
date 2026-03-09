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

interface BillingCycleListProps {
    showUpdate?: (bc: BillingCycle) => void;
    reloadKey?: number;
}

const BillingCycleList = ({ showUpdate, reloadKey }: BillingCycleListProps) => {
    const [billingCycles, setBillingCycles] = useState<BillingCycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchList = () => {
        setLoading(true);
        setError(null);
        axios.get('/api/billingCycle')
            .then(res => {
                setBillingCycles(res.data ?? []);
                setLoading(false);
            })
            .catch(err => {
                setError('Erro ao carregar os ciclos de pagamento');
                setLoading(false);
                console.error('Erro ao buscar billing cycles:', err);
            });
    };

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

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
                <button className='btn btn-default' onClick={fetchList}>Tentar novamente</button>
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
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {billingCycles.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>
                                Nenhum ciclo de pagamento encontrado
                            </td>
                        </tr>
                    ) : (
                        billingCycles.map(bc => (
                            <tr key={bc.id}>
                                <td>{bc.name}</td>
                                <td>{getMonthName(bc.month)}</td>
                                <td>{bc.year}</td>
                                <td>
                                    <button className='btn btn-warning' onClick={() => showUpdate?.(bc)} title="Editar">
                                        <i className="fa fa-pencil"></i>
                                    </button>
                                    {' '}
                                    <button
                                        className='btn btn-danger'
                                        title="Excluir"
                                        onClick={async () => {
                                            const ok = window.confirm('Tem certeza que deseja excluir esse registro?');
                                            if (!ok) return;
                                            try {
                                                await axios.delete(`/api/billingCycle/${bc.id}`);
                                                fetchList();
                                            } catch (err: any) {
                                                console.error('Erro ao excluir billing cycle:', err);
                                                alert(err?.response?.data?.error || 'Erro ao excluir o registro');
                                            }
                                        }}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BillingCycleList;