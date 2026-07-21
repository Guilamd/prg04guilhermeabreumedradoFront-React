import React, { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext();

export function PreferencesProvider({ children }) {
  const [hideBalances, setHideBalances] = useState(() => {
    return localStorage.getItem('@app_hideBalances') === 'true';
  });

  const [theme, setTheme] = useState(() => {
    localStorage.setItem('@app_theme', 'dark');
    return 'dark';
  });

  const [fluidAnimations, setFluidAnimations] = useState(() => {
    return localStorage.getItem('@app_animations') !== 'false'; // Padrão true
  });

  // Atualizar tema no HTML e salvar
  useEffect(() => {
    localStorage.setItem('@app_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Atualizar animações no HTML e salvar
  useEffect(() => {
    localStorage.setItem('@app_animations', fluidAnimations.toString());
    document.documentElement.setAttribute('data-animations', fluidAnimations.toString());
  }, [fluidAnimations]);

  // Salvar ocultação
  useEffect(() => {
    localStorage.setItem('@app_hideBalances', hideBalances.toString());
    document.documentElement.setAttribute('data-hide-balances', hideBalances.toString());
  }, [hideBalances]);

  return (
    <PreferencesContext.Provider value={{
      hideBalances, setHideBalances,
      theme, setTheme,
      fluidAnimations, setFluidAnimations
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
