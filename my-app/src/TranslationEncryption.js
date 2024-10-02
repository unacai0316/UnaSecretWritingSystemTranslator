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
  '1': '/images/1.png', 'q': '/images/2.png', 'a': '/images/3.png', 'z': '/images/4.png',
  '2': '/images/5.png', 'w': '/images/6.png', 's': '/images/7.png', 'x': '/images/8.png',
  'e': '/images/9.png', 'd': '/images/10.png', 'c': '/images/11.png',
  'r': '/images/12.png', 'f': '/images/13.png', 'v': '/images/14.png',
  '5': '/images/15.png', 't': '/images/16.png', 'g': '/images/17.png', 'b': '/images/18.png',
  'y': '/images/19.png', 'h': '/images/20.png', 'n': '/images/21.png',
  'u': '/images/22.png', 'j': '/images/23.png', 'm': '/images/24.png',
  '8': '/images/25.png', 'i': '/images/26.png', 'k': '/images/27.png', ',': '/images/28.png',
  '9': '/images/29.png', 'o': '/images/30.png', 'l': '/images/31.png', '.': '/images/32.png',
  '0': '/images/33.png', 'p': '/images/34.png', ';': '/images/35.png', '/': '/images/36.png',
  '-': '/images/37.png',
  '6': '/images/38.png', '3': '/images/39.png', '4': '/images/40.png', '7': '/images/41.png'
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
      <h2 className="text-2xl font-bold mb-4">翻譯加密器</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        placeholder="please enter english words"
      />
      <button
        onClick={handleTranslate}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        translate and encrypt
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && (
        <div className="mt-4 p-2 bg-white rounded">
          <pre>{result}</pre>
          <div className="mt-2">
            {renderEncryptedImages(result.split('encrypted：')[1])}
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationEncryption;