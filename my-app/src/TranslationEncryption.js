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
  '1': 'UnaSecretWritingSystemTranslator/images/1.png', 'q': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/2.png', 'a': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/3.png', 'z': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/4.png',
  '2': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/5.png', 'w': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/6.png', 's': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/7.png', 'x': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/8.png',
  'e': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/9.png', 'd': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/10.png', 'c': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/11.png',
  'r': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/12.png', 'f': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/13.png', 'v': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/14.png',
  '5': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/15.png', 't': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/16.png', 'g': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/17.png', 'b': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/18.png',
  'y': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/19.png', 'h': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/20.png', 'n': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/21.png',
  'u': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/22.png', 'j': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/23.png', 'm': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/24.png',
  '8': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/25.png', 'i': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/26.png', 'k': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/27.png', ',': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/28.png',
  '9': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/29.png', 'o': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/30.png', 'l': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/31.png', '.': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/32.png',
  '0': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/33.png', 'p': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/34.png', ';': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/35.png', '/': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/36.png',
  '-': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/37.png',
  '6': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/38.png', '3': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/39.png', '4': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/40.png', '7': 'UnaSecretWritingSystemTranslatorUnaSecretWritingSystemTranslator/images/41.png'
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