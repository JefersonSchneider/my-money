import type { ReactNode } from 'react'; 
import Dependencies from './common/template/dependencies'; 
import Header from './common/template/header';
import SideBar from './common/template/sideBar';
import Footer from './common/template/footer';
import SidebarToggle from './common/template/sidebarToggle';

export const metadata = {
  title: 'My Money App',
  description: 'Controle financeiro pessoal',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="skin-blue sidebar-mini">
        <Dependencies />
        <SidebarToggle/>
        <div className="wrapper">
          <Header />
          <SideBar />
          <div className="content-wrapper">
            {children}
          </div>
          <Footer/>
        </div>
      </body>
    </html>
  );
}