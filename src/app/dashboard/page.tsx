"use client";
import { useEffect, useState } from "react";
import Content from "../common/template/content";
import ContentHeader from "../common/template/contentHeader";
import ValueBox from "../common/widget/valueBox";
import Row from "../common/layout/row";
import axios from "axios";
import { use } from "modules/@types/react";
// Using relative URLs avoids CORS issues and works both in dev and production

const Dashboard = () => {
    const [credit, setCredit] = useState(0);
    const [debt, setDebt] = useState(0);
    const balance = credit - debt;

    useEffect(() => {
        let cancelled = false;
        axios.get('/api/billingCycle/summary')
            .then(res => {
                console.log('summary response', res.data);
                if (cancelled) return;
                const { credit = 0, debt = 0 } = res.data ?? {};
                setCredit(credit);
                setDebt(debt);
            })
            .catch(err => {
                console.error('summary fetch failed', err);
                if (cancelled) return;
                setCredit(0);
                setDebt(0);
            });
        return () => { cancelled = true; };
    }, []);



    return (
        <div>
            <ContentHeader title="Dashboard" small="Versão 1.0" />
            <Content>
                <Row>
                    <ValueBox cols='12 4' color='green' icon='bank'
                        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(credit)}
                        text='Total de Créditos' />
                    <ValueBox cols='12 4' color='red' icon='credit-card'
                        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(debt)}
                        text='Total de Débitos' />
                    <ValueBox cols='12 4' color='blue' icon='money'
                        value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                        text='Valor Consolidado' />
                </Row>
            </Content>
        </div>
    );
}

export default Dashboard;

