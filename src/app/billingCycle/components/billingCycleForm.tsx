"use client";
import { useState } from "react";
import axios from "axios";
import Row from "../../common/layout/row";
import Grid from "../../common/layout/grid";

const BillingCycleForm = () => {
    const [name, setName] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
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
            const response = await axios.post('/api/billingCycle', {
                name: name.trim(),
                month: monthNum,
                year: yearNum,
            });

            if (response.status === 201) {
                setSuccess(true);
                // Limpar formulário
                setName("");
                setMonth("");
                setYear("");
                // Limpar mensagem de sucesso após 3 segundos
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err: any) {
            if (err.response?.status === 409) {
                setError(err.response.data.error || "Já existe um ciclo de pagamento para este mês/ano");
            } else if (err.response?.status === 400) {
                setError(err.response.data.error || "Dados inválidos");
            } else {
                setError("Erro ao salvar o ciclo de pagamento");
            }
            console.error('Erro ao criar billing cycle:', err);
        } finally {
            setLoading(false);
        }
    };

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
                    Ciclo de pagamento criado com sucesso!
                </div>
            )}
            <div className="box-footer">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </form>
    );
};

export default BillingCycleForm;