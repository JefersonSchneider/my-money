// dependencies.tsx
'use client';

import { useEffect } from 'react';

// Imports CSS
import 'modules/font-awesome/css/font-awesome.min.css';
import 'modules/ionicons/dist/css/ionicons.min.css';
import 'modules/admin-lte/bootstrap/css/bootstrap.min.css';
import 'modules/admin-lte/dist/css/AdminLTE.min.css';
import 'modules/admin-lte/dist/css/skins/_all-skins.min.css';
import './custom.css';

export default function Dependencies() {
  useEffect(() => {
    // Inicializar AdminLTE TreeView
    const initTreeView = () => {
      const treeviewMenu = document.querySelectorAll('.treeview');
      
      treeviewMenu.forEach((menu) => {
        const link = menu.querySelector('a');
        
        if (link) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Toggle da classe 'active'
            menu.classList.toggle('active');
            
            // Fechar outros menus
            treeviewMenu.forEach((otherMenu) => {
              if (otherMenu !== menu) {
                otherMenu.classList.remove('active');
              }
            });
          });
        }
      });
    };

    // Aguardar o DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTreeView);
    } else {
      initTreeView();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', initTreeView);
    };
  }, []);

  return null;
}