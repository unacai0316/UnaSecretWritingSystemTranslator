import React from 'react';
import './App.css'; // 導入 CSS 文件
import TranslationEncryption from './TranslationEncryption'; // Adjust the path as necessary

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the Translator App</h1>
        <TranslationEncryption />
      </header>
    </div>
  );
}

export default App;