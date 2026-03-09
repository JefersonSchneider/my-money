"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Row from "../../common/layout/row";
import Grid from "../../common/layout/grid";

interface DebtFormProps {
    mode?: 'create' | 'edit';
    initialValues?: {
        id: number;
        name: string;
        value: number;
        status: "PAGO" | "PENDENTE" | "AGENDADO";
        billingCycleId: number;
    } | null;
    billingCycleId?: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const DebtForm: React.FC<DebtFormProps> = ({ 
    mode = 'create', 
    initialValues, 
    billingCycleId,
    onSuccess, 
    onCancel 
}) => {
    const [name, setName] = useState(initialValues?.name ?? "");
    const [value, setValue] = useState(initialValues?.value?.toString?.() ?? "");
    const [status, setStatus] = useState(initialValues?.status ?? "PENDENTE");
    const [selectedBillingCycleId, setSelectedBillingCycleId] = useState(
        initialValues?.billingCycleId ?? billingCycleId ?? ""
    );

    useEffect(() => {
        if (mode === 'edit' && initialValues) {
            setName(initialValues.name);
            setValue(initialValues.value.toString());
            setStatus(initialValues.status);
            setSelectedBillingCycleId(initialValues.billingCycleId);
        } else if (mode === 'create') {
            setName("");
            setValue("");
            setStatus("PENDENTE");
            setSelectedBillingCycleId(billingCycleId ?? "");
        }
        setError(null);
        setSuccess(false);
    }, [initialValues, mode, billingCycleId]);
    const [billingCycles, setBillingCycles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Carregar ciclos de pagamento disponíveis
        axios.get('/api/billingCycle')
            .then(res => setBillingCycles(res.data ?? []))
            .catch(err => console.error('Erro ao carregar ciclos:', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!name.trim()) {
            setError("O nome é obrigatório");
            return;
        }

        const valueNum = parseFloat(value);
        if (!value || isNaN(valueNum) || valueNum <= 0) {
            setError("O valor deve ser um número positivo");
            return;
        }

        if (!selectedBillingCycleId) {
            setError("Selecione um ciclo de pagamento");
            return;
        }

        setLoading(true);

        try {
            if (mode === 'edit' && initialValues?.id) {
                const payload: any = {};
                if (initialValues.name !== name) payload.name = name.trim();
                if (Number(initialValues.value) !== valueNum) payload.value = valueNum;
                if (initialValues.status !== status) payload.status = status;
                if (Number(initialValues.billingCycleId) !== Number(selectedBillingCycleId)) {
                    payload.billingCycleId = Number(selectedBillingCycleId);
                }

                if (Object.keys(payload).length === 0) {
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 2000);
                    return;
                }

                const response = await axios.put(`/api/debt/${initialValues.id}`, payload);
                if (response.status === 200) {
                    setSuccess(true);
                    if (onSuccess) {
                        onSuccess();
                        return;
                    }
                    setTimeout(() => setSuccess(false), 3000);
                }
            } else {
                const response = await axios.post('/api/debt', {
                    name: name.trim(),
                    value: valueNum,
                    status: status,
                    billingCycleId: Number(selectedBillingCycleId),
                });

                if (response.status === 201) {
                    setSuccess(true);
                    if (onSuccess) {
                        onSuccess();
                        return;
                    }
                    setName("");
                    setValue("");
                    setStatus("PENDENTE");
                    setSelectedBillingCycleId(billingCycleId ?? "");
                    setTimeout(() => setSuccess(false), 3000);
                }
            }
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError(err.response.data?.error ?? "Despesa já existe neste ciclo");
            } else {
                setError(err.response?.data?.error ?? "Erro ao processar despesa");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Row>
                <Grid cols="12 12 4 4">
                    <div className="form-group">
                        <label htmlFor="name">Nome:</label>
                        <input
                            id="name"
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome da despesa"
                        />
                    </div>
                </Grid>
                <Grid cols="12 12 4 4">
                    <div className="form-group">
                        <label htmlFor="value">Valor:</label>
                        <input
                            id="value"
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </Grid>
                <Grid cols="12 12 4 4">
                    <div className="form-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as "PAGO" | "PENDENTE" | "AGENDADO")}
                        >
                            <option value="PENDENTE">Pendente</option>
                            <option value="PAGO">Pago</option>
                            <option value="AGENDADO">Agendado</option>
                        </select>
                    </div>
                </Grid>
            </Row>

            <Row>
                <Grid cols="12 12 4 4">
                    <div className="form-group">
                        <label htmlFor="billingCycle">Ciclo de Pagamento:</label>
                        <select
                            id="billingCycle"
                            className="form-control"
                            value={selectedBillingCycleId}
                            onChange={(e) => setSelectedBillingCycleId(e.target.value)}
                        >
                            <option value="">Selecione um ciclo</option>
                            {billingCycles.map(bc => (
                                <option key={bc.id} value={bc.id}>
                                    {bc.name} - {bc.month}/{bc.year}
                                </option>
                            ))}
                        </select>
                    </div>
                </Grid>
            </Row>

            {error && (
                <Row>
                    <Grid cols="12 12 12 12">
                        <div style={{ color: 'red', marginBottom: '10px' }}>
                            {error}
                        </div>
                    </Grid>
                </Row>
            )}

            {success && (
                <Row>
                    <Grid cols="12 12 12 12">
                        <div style={{ color: 'green', marginBottom: '10px' }}>
                            Despesa salva com sucesso!
                        </div>
                    </Grid>
                </Row>
            )}

            <Row>
                <Grid cols="12 12 12 12">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : mode === 'edit' ? 'Atualizar' : 'Incluir'}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={onCancel}
                            style={{ marginLeft: '10px' }}
                        >
                            Cancelar
                        </button>
                    )}
                </Grid>
            </Row>
        </form>
    );
};

export default DebtForm;
