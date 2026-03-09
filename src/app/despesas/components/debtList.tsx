"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Debt = {
    id: number;
    name: string;
    value: number;
    status: "PAGO" | "PENDENTE" | "AGENDADO";
    billingCycleId: number;
    createdAt: string;
    updatedAt: string;
    billingCycle?: {
        id: number;
        name: string;
        month: number;
        year: number;
    };
};

interface DebtListProps {
    showUpdate?: (debt: Debt) => void;
    showDelete?: (debt: Debt) => void;
    reloadKey?: number;
}

const DebtList = ({ showUpdate, showDelete, reloadKey }: DebtListProps) => {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchList = () => {
        setLoading(true);
        setError(null);
        axios.get('/api/debt')
            .then(res => {
                setDebts(res.data ?? []);
                setLoading(false);
            })
            .catch(err => {
                setError('Erro ao carregar as despesas');
                setLoading(false);
                console.error('Erro ao buscar debts:', err);
            });
    };

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja deletar esta despesa?')) {
            return;
        }

        try {
            await axios.delete(`/api/debt/${id}`);
            fetchList();
        } catch (err) {
            setError('Erro ao deletar despesa');
            console.error('Erro ao deletar debt:', err);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: { [key: string]: string } = {
            'PAGO': 'green',
            'PENDENTE': 'red',
            'AGENDADO': 'blue'
        };
        return (
            <span style={{
                backgroundColor: colors[status] || 'gray',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '12px'
            }}>
                {status}
            </span>
        );
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
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ciclo</th>
                        <th>Data Criação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {debts.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: 'center' }}>
                                Nenhuma despesa encontrada
                            </td>
                        </tr>
                    ) : (
                        debts.map(debt => (
                            <tr key={debt.id}>
                                <td>{debt.name}</td>
                                <td>
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(debt.value)}
                                </td>
                                <td>{getStatusBadge(debt.status)}</td>
                                <td>
                                    {debt.billingCycle ? 
                                        `${debt.billingCycle.name} (${debt.billingCycle.month}/${debt.billingCycle.year})`
                                        : 'N/A'
                                    }
                                </td>
                                <td>{new Date(debt.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <button
                                        className='btn btn-warning'
                                        onClick={() => showUpdate?.(debt)}
                                        title="Editar"
                                    >
                                        <i className='fa fa-pencil'></i>
                                    </button>
                                    {' '}
                                    <button
                                        className='btn btn-danger'
                                        onClick={() => handleDelete(debt.id)}
                                        title="Excluir"
                                    >
                                        <i className='fa fa-trash'></i>
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

export default DebtList;
