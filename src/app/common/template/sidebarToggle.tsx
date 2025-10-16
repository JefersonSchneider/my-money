'use client';

import { useEffect } from 'react';

export default function SidebarToggle() {
  useEffect(() => {
    const handleToggle = () => {
      const body = document.body;
      
      // Toggle da classe que controla a sidebar
      if (body.classList.contains('sidebar-collapse')) {
        body.classList.remove('sidebar-collapse');
        // Salvar estado no sessionStorage
        sessionStorage.setItem('sidebar-state', 'open');
      } else {
        body.classList.add('sidebar-collapse');
        // Salvar estado no sessionStorage
        sessionStorage.setItem('sidebar-state', 'collapsed');
      }
    };

    // Restaurar estado salvo ao carregar a página
    const savedState = sessionStorage.getItem('sidebar-state');
    if (savedState === 'collapsed') {
      document.body.classList.add('sidebar-collapse');
    }

    // Adicionar event listener ao botão de toggle
    const toggleBtn = document.querySelector('.sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', handleToggle);
    }

    // Cleanup
    return () => {
      if (toggleBtn) {
        toggleBtn.removeEventListener('click', handleToggle);
      }
    };
  }, []);

  return null;
}