"use client";

import { useState } from 'react';
import ContentHeader from '../common/template/contentHeader';
import Content from '../common/template/content';
import Tabs from '../common/tab/tabs';
import TabsHeader from '../common/tab/tabsHeader';
import TabsContent from '../common/tab/tabsContent';
import TabHeader from '../common/tab/tabHeader';
import TabContent from '../common/tab/tabContent';
import BillingCycleList from './components/billingCycleList';
import BillingCycleForm from './components/billingCycleForm';

const BillingCyclePage = () => {
    const [selectedTab, setSelectedTab] = useState('tabList');

    return (
        <div>
            <ContentHeader title="Ciclos de Pagamento" small="Cadastro" />
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
                        <TabHeader
                            icon="pencil"
                            label="Alterar"
                            isActive={selectedTab === 'tabUpdate'}
                            onClick={() => setSelectedTab('tabUpdate')}
                        />
                        <TabHeader
                            icon="trash-o"
                            label="Excluir"
                            isActive={selectedTab === 'tabDelete'}
                            onClick={() => setSelectedTab('tabDelete')}
                        />
                    </TabsHeader>
                    <TabsContent>
                        <TabContent id="tabList" tab={{ selected: selectedTab }}>
                            <BillingCycleList />
                        </TabContent>
                        <TabContent id="tabCreate" tab={{ selected: selectedTab }}>
                            <BillingCycleForm />
                        </TabContent>
                        <TabContent id="tabUpdate" tab={{ selected: selectedTab }}><h1>Alterar</h1></TabContent>
                        <TabContent id="tabDelete" tab={{ selected: selectedTab }}><h1>Excluir</h1></TabContent>
                    </TabsContent>
                </Tabs>
            </Content>
        </div>
    );
}

export default BillingCyclePage;