"use client";

import { useState } from 'react';
import ContentHeader from '../common/template/contentHeader';
import Content from '../common/template/content';
import Tabs from '../common/tab/tabs';
import TabsHeader from '../common/tab/tabsHeader';
import TabsContent from '../common/tab/tabsContent';
import TabHeader from '../common/tab/tabHeader';
import TabContent from '../common/tab/tabContent';
import DebtList from './components/debtList';
import DebtForm from './components/debtForm';

type Debt = {
    id: number;
    name: string;
    value: number;
    status: "PAGO" | "PENDENTE" | "AGENDADO";
    billingCycleId: number;
};

const DespesasPage = () => {
    const [selectedTab, setSelectedTab] = useState('tabList');
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    return (
        <div>
            <ContentHeader title="Despesas" small="Cadastro" />
            <Content>
                <Tabs>
                    <TabsHeader>
                        <TabHeader
                            icon="bars"
                            label="Listar"
                            isActive={selectedTab === 'tabList'}
                            onClick={() => setSelectedTab('tabList')}
                        />
                        <TabHeader
                            icon="plus"
                            label="Incluir"
                            isActive={selectedTab === 'tabCreate'}
                            onClick={() => setSelectedTab('tabCreate')}
                        />
                    </TabsHeader>
                    <TabsContent>
                        <TabContent id="tabList" tab={{ selected: selectedTab }}>
                            <DebtList
                                showUpdate={(debt: Debt) => {
                                    setSelectedDebt(debt);
                                    setSelectedTab('tabUpdate');
                                }}
                                reloadKey={reloadKey}
                            />
                        </TabContent>
                        <TabContent id="tabCreate" tab={{ selected: selectedTab }}>
                            <DebtForm
                                onSuccess={() => {
                                    setSelectedTab('tabList');
                                    setReloadKey(k => k + 1);
                                }}
                                onCancel={() => setSelectedTab('tabList')}
                            />
                        </TabContent>
                        <TabContent id="tabUpdate" tab={{ selected: selectedTab }}>
                            {selectedDebt ? (
                                <DebtForm
                                    mode="edit"
                                    initialValues={{
                                        id: selectedDebt.id,
                                        name: selectedDebt.name,
                                        value: selectedDebt.value,
                                        status: selectedDebt.status,
                                        billingCycleId: selectedDebt.billingCycleId,
                                    }}
                                    onSuccess={() => {
                                        setSelectedTab('tabList');
                                        setReloadKey(k => k + 1);
                                    }}
                                    onCancel={() => setSelectedTab('tabList')}
                                />
                            ) : (
                                <p>Nenhuma despesa selecionada.</p>
                            )}
                        </TabContent>
                    </TabsContent>
                </Tabs>
            </Content>
        </div>
    );
}

export default DespesasPage;
