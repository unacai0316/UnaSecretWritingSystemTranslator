import React, { useState } from 'react';
import axios from 'axios';
import { pinyinToZhuyin } from 'pinyin-zhuyin';
import { pinyin } from 'pinyin-pro';
import './App.css';

const zhuyin2keyboard = {
  'ㄅ': '1', 'ㄆ': 'q', 'ㄇ': 'a', 'ㄈ': 'z',
  'ㄉ': '2', 'ㄊ': 'w', 'ㄋ': 's', 'ㄌ': 'x',
  'ㄍ': 'e', 'ㄎ': 'd', 'ㄏ': 'c',
  'ㄐ': 'r', 'ㄑ': 'f', 'ㄒ': 'v',
  'ㄓ': '5', 'ㄔ': 't', 'ㄕ': 'g', 'ㄖ': 'b',
  'ㄗ': 'y', 'ㄘ': 'h', 'ㄙ': 'n',
  'ㄧ': 'u', 'ㄨ': 'j', 'ㄩ': 'm',
  'ㄚ': '8', 'ㄛ': 'i', 'ㄜ': 'k', 'ㄝ': ',',
  'ㄞ': '9', 'ㄟ': 'o', 'ㄠ': 'l', 'ㄡ': '.',
  'ㄢ': '0', 'ㄣ': 'p', 'ㄤ': ';', 'ㄥ': '/',
  'ㄦ': '-',
  'ˊ': '6', 'ˇ': '3', 'ˋ': '4', '˙': '7'
};

const translateAPI = async (text) => {
  const apiKey = 'AIzaSyCAxoFUMU9yZNjUjHDTl8d41m6J7P7MSGg'; // 請確保替換為您的實際 API 金鑰
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
  try {
    const response = await axios.post(url, {
      q: text,
      target: 'zh-TW',
      source: 'en',
      format: 'text'
    });
    
    if (response.data && response.data.data && response.data.data.translations) {
      return response.data.data.translations[0].translatedText;
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error translating text:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

const chinese2zhuyin = (text) => {
  const pinyinText = pinyin(text, { toneType: 'symbol', type: 'array' }).flat().join(' ');
  return pinyinToZhuyin(pinyinText);
};

const zhuyin2keyboard2 = (zhuyin) => {
  return zhuyin.split('').map(char => zhuyin2keyboard[char] || char).join('');
};

const fontImageMap = {
  '1': '/UnaSecretWritingSystemTranslator/images/1.png', 'q': '/UnaSecretWritingSystemTranslator/images/2.png', 'a': '/UnaSecretWritingSystemTranslator/images/3.png', 'z': '/UnaSecretWritingSystemTranslator/images/4.png',
  '2': '/UnaSecretWritingSystemTranslator/images/5.png', 'w': '/UnaSecretWritingSystemTranslator/images/6.png', 's': '/UnaSecretWritingSystemTranslator/images/7.png', 'x': '/UnaSecretWritingSystemTranslator/images/8.png',
  'e': '/UnaSecretWritingSystemTranslator/images/9.png', 'd': '/UnaSecretWritingSystemTranslator/images/10.png', 'c': '/UnaSecretWritingSystemTranslator/images/11.png',
  'r': '/UnaSecretWritingSystemTranslator/images/12.png', 'f': '/UnaSecretWritingSystemTranslator/images/13.png', 'v': '/UnaSecretWritingSystemTranslator/images/14.png',
  '5': '/UnaSecretWritingSystemTranslator/images/15.png', 't': '/UnaSecretWritingSystemTranslator/images/16.png', 'g': '/UnaSecretWritingSystemTranslator/images/17.png', 'b': '/UnaSecretWritingSystemTranslator/images/18.png',
  'y': '/UnaSecretWritingSystemTranslator/images/19.png', 'h': '/UnaSecretWritingSystemTranslator/images/20.png', 'n': '/UnaSecretWritingSystemTranslator/images/21.png',
  'u': '/UnaSecretWritingSystemTranslator/images/22.png', 'j': '/UnaSecretWritingSystemTranslator/images/23.png', 'm': '/UnaSecretWritingSystemTranslator/images/24.png',
  '8': '/UnaSecretWritingSystemTranslator/images/25.png', 'i': '/UnaSecretWritingSystemTranslator/images/26.png', 'k': '/UnaSecretWritingSystemTranslator/images/27.png', ',': '/UnaSecretWritingSystemTranslator/images/28.png',
  '9': '/UnaSecretWritingSystemTranslator/images/29.png', 'o': '/UnaSecretWritingSystemTranslator/images/30.png', 'l': '/UnaSecretWritingSystemTranslator/images/31.png', '.': '/UnaSecretWritingSystemTranslator/images/32.png',
  '0': '/UnaSecretWritingSystemTranslator/images/33.png', 'p': '/UnaSecretWritingSystemTranslator/images/34.png', ';': '/UnaSecretWritingSystemTranslator/images/35.png', '/': '/UnaSecretWritingSystemTranslator/images/36.png',
  '-': '/UnaSecretWritingSystemTranslator/images/37.png',
  '6': '/UnaSecretWritingSystemTranslator/images/38.png', '3': '/UnaSecretWritingSystemTranslator/images/39.png', '4': '/UnaSecretWritingSystemTranslator/images/40.png', '7': '/UnaSecretWritingSystemTranslator/images/41.png'
};

const TranslationEncryption = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    try {
      setError('');
      const chinese = await translateAPI(input);
      const zhuyin = chinese2zhuyin(chinese);
      const encrypted = zhuyin2keyboard2(zhuyin);
      setResult(`in Chinese(Traditional)：${chinese}\nin Bopompho：${zhuyin}\nencrypted：${encrypted}`);
    } catch (error) {
      setError(`轉換過程中出現錯誤: ${error.message}`);
      setResult('');
    }
  };

  const renderEncryptedImages = (encrypted) => {
    return encrypted.split('').map((char, index) => (
      <React.Fragment key={index}>
        {char === ' ' ? (
          <span className="group-spacing"></span>
        ) : (
          <img src={fontImageMap[char]} alt={char} className="inline font-image" />
        )}
      </React.Fragment>
    ));
  };


  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">ㄅㄆㄇㄈ翻譯加密器</h2>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-field"
          placeholder="please enter english words"
        />
        <button
          onClick={handleTranslate}
          className="translate-button"
        >
          translate and encrypt
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="mt-4 p-2 bg-white rounded limited-width mb-4">
        <pre>{result}</pre>
        <div className="mt-2 p-4 bg-white rounded limited-width">
          {renderEncryptedImages(result.split('encrypted：')[1])}
        </div>
      </div>
      )}
    </div>
  );
};

export default TranslationEncryption;