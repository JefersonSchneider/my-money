"use client";

import { useState } from 'react';
import ContentHeader from '../common/template/contentHeader';
import Content from '../common/template/content';
import Tabs from '../common/tab/tabs';
import TabsHeader from '../common/tab/tabsHeader';
import TabsContent from '../common/tab/tabsContent';
import TabHeader from '../common/tab/tabHeader';
import TabContent from '../common/tab/tabContent';
import CreditList from './components/creditList';
import CreditForm from './components/creditForm';

type Credit = {
    id: number;
    name: string;
    value: number;
    billingCycleId: number;
};

const ReceeitasPage = () => {
    const [selectedTab, setSelectedTab] = useState('tabList');
    const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    return (
        <div>
            <ContentHeader title="Receitas" small="Cadastro" />
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
                            <CreditList
                                showUpdate={(credit: Credit) => {
                                    setSelectedCredit(credit);
                                    setSelectedTab('tabUpdate');
                                }}
                                reloadKey={reloadKey}
                            />
                        </TabContent>
                        <TabContent id="tabCreate" tab={{ selected: selectedTab }}>
                            <CreditForm
                                onSuccess={() => {
                                    setSelectedTab('tabList');
                                    setReloadKey(k => k + 1);
                                }}
                                onCancel={() => setSelectedTab('tabList')}
                            />
                        </TabContent>
                        <TabContent id="tabUpdate" tab={{ selected: selectedTab }}>
                            {selectedCredit ? (
                                <CreditForm
                                    mode="edit"
                                    initialValues={{
                                        id: selectedCredit.id,
                                        name: selectedCredit.name,
                                        value: selectedCredit.value,
                                        billingCycleId: selectedCredit.billingCycleId,
                                    }}
                                    onSuccess={() => {
                                        setSelectedTab('tabList');
                                        setReloadKey(k => k + 1);
                                    }}
                                    onCancel={() => setSelectedTab('tabList')}
                                />
                            ) : (
                                <p>Nenhuma receita selecionada.</p>
                            )}
                        </TabContent>
                    </TabsContent>
                </Tabs>
            </Content>
        </div>
    );
}

export default ReceeitasPage;
