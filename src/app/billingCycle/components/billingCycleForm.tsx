"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Row from "../../common/layout/row";
import Grid from "../../common/layout/grid";
import { useRouter } from "next/navigation";

interface BillingCycleFormProps {
    mode?: 'create' | 'edit';
    initialValues?: {
        id: number;
        name: string;
        month: number | string;
        year: number | string;
    } | null;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const BillingCycleForm: React.FC<BillingCycleFormProps> = ({ mode = 'create', initialValues, onSuccess, onCancel }) => {
    const router = useRouter();
    const [name, setName] = useState(initialValues?.name ?? "");
    const [month, setMonth] = useState(initialValues?.month?.toString?.() ?? "");
    const [year, setYear] = useState(initialValues?.year?.toString?.() ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validação básica
        if (!name.trim()) {
            setError("O nome é obrigatório");
            return;
        }

        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);

        if (!month || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            setError("Mês inválido (deve ser entre 1 e 12)");
            return;
        }

        if (!year || isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
            setError("Ano inválido (deve ser entre 1900 e 2100)");
            return;
        }

        setLoading(true);

        try {
            if (mode === 'edit' && initialValues?.id) {
                const payload: any = {};
                // enviar apenas campos que mudaram
                if (initialValues.name !== name) payload.name = name.trim();
                if (Number(initialValues.month) !== monthNum) payload.month = monthNum;
                if (Number(initialValues.year) !== yearNum) payload.year = yearNum;

                // Se nada mudou, apenas feedback e sair
                if (Object.keys(payload).length === 0) {
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 2000);
                    return;
                }

                const response = await axios.put(`/api/billingCycle/${initialValues.id}`, payload);
                if (response.status === 200) {
                    setSuccess(true);
                    if (onSuccess) {
                        onSuccess();
                        return;
                    }
                    setTimeout(() => setSuccess(false), 3000);
                }
            } else {
                const response = await axios.post('/api/billingCycle', {
                    name: name.trim(),
                    month: monthNum,
                    year: yearNum,
                });

                if (response.status === 201) {
                    setSuccess(true);
                    // Se o pai passar onSuccess, priorizar navegação/refresh externo
                    if (onSuccess) {
                        onSuccess();
                        return;
                    }
                    // Caso contrário, manter comportamento atual de limpar formulário
                    setName("");
                    setMonth("");
                    setYear("");
                    setTimeout(() => setSuccess(false), 3000);
                }
            }
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError(err.response.data.error || "Já existe um ciclo de pagamento para este mês/ano");
            } else if (err.response?.status === 400) {
                setError(err.response.data.error || "Dados inválidos");
            } else if (err.response?.status === 404) {
                setError(err.response.data.error || "Ciclo de pagamento não encontrado");
            } else {
                setError("Erro ao salvar o ciclo de pagamento");
            }
            console.error('Erro ao salvar billing cycle:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mode === 'edit' && initialValues) {
            setName(initialValues.name ?? "");
            setMonth(initialValues.month?.toString?.() ?? "");
            setYear(initialValues.year?.toString?.() ?? "");
        }
    }, [mode, initialValues]);

    return (
        <form role="form" onSubmit={handleSubmit}>
            <div className="box-body">
                <Row>
                    <Grid cols="12 12 4 4">
                        <div className="form-group">
                            <label htmlFor="name">Nome</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                name="name"
                                placeholder="Informe o nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </Grid>
                    <Grid cols="12 12 4 4">
                        <div className="form-group">
                            <label htmlFor="month">Mês</label>
                            <input
                                type="number"
                                id="month"
                                className="form-control"
                                name="month"
                                placeholder="Informe o mês"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                min="1"
                                max="12"
                            />
                        </div>
                    </Grid>
                    <Grid cols="12 12 4 4">
                        <div className="form-group">
                            <label htmlFor="year">Ano</label>
                            <input
                                type="number"
                                id="year"
                                className="form-control"
                                name="year"
                                placeholder="Informe o ano"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                min="1900"
                                max="2100"
                            />
                        </div>
                    </Grid>
                </Row>
            </div>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {success && (
                <div className="alert alert-success" role="alert">
                    {mode === 'edit' ? 'Dados carregados para edição.' : 'Ciclo de pagamento criado com sucesso!'}
                </div>
            )}
            <div className="box-footer">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? (mode === 'edit' ? 'Atualizando...' : 'Salvando...') : (mode === 'edit' ? 'Atualizar' : 'Salvar')}
                </button>
                {' '}
                <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => {
                        if (onCancel) return onCancel();
                        // fallback: ir para a página de ciclos (onde há as abas)
                        router.push('/billingCycle');
                    }}
                    disabled={loading}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default BillingCycleForm;