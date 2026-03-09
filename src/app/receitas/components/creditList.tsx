"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Credit = {
    id: number;
    name: string;
    value: number;
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

interface CreditListProps {
    showUpdate?: (credit: Credit) => void;
    showDelete?: (credit: Credit) => void;
    reloadKey?: number;
}

const CreditList = ({ showUpdate, showDelete, reloadKey }: CreditListProps) => {
    const [credits, setCredits] = useState<Credit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchList = () => {
        setLoading(true);
        setError(null);
        axios.get('/api/credit')
            .then(res => {
                setCredits(res.data ?? []);
                setLoading(false);
            })
            .catch(err => {
                setError('Erro ao carregar as receitas');
                setLoading(false);
                console.error('Erro ao buscar credits:', err);
            });
    };

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadKey]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja deletar esta receita?')) {
            return;
        }

        try {
            await axios.delete(`/api/credit/${id}`);
            fetchList();
        } catch (err) {
            setError('Erro ao deletar receita');
            console.error('Erro ao deletar credit:', err);
        }
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
                        <th>Ciclo</th>
                        <th>Data Criação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {credits.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                Nenhuma receita encontrada
                            </td>
                        </tr>
                    ) : (
                        credits.map(credit => (
                            <tr key={credit.id}>
                                <td>{credit.name}</td>
                                <td>
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(credit.value)}
                                </td>
                                <td>
                                    {credit.billingCycle ? 
                                        `${credit.billingCycle.name} (${credit.billingCycle.month}/${credit.billingCycle.year})`
                                        : 'N/A'
                                    }
                                </td>
                                <td>{new Date(credit.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <button
                                        className='btn btn-warning'
                                        onClick={() => showUpdate?.(credit)}
                                        title="Editar"
                                    >
                                        <i className='fa fa-pencil'></i>
                                    </button>
                                    {' '}
                                    <button
                                        className='btn btn-danger'
                                        onClick={() => handleDelete(credit.id)}
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

export default CreditList;
