/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Book, Shield, Scroll, Swords, Github, ExternalLink, Info, Wand2, User } from 'lucide-react';
import { motion } from 'motion/react';
import { classes } from '../data/classes';
import { races } from '../data/races';

export function LandingPage() {
  const { dispatch } = useCharacter();
  const [savedChars, setSavedChars] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dndChars');
      if (saved) {
        const parsed = JSON.parse(saved);
        let updated = false;
        const mapped = parsed.map((char: any, i: number) => {
          if (!char.id) {
            char.id = crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`;
            updated = true;
          }
          return char;
        });
        if (updated) {
          localStorage.setItem('dndChars', JSON.stringify(mapped));
        }
        setSavedChars(mapped);
      }
    } catch(e) {}
  }, []);

  const handleStartCreation = () => {
    dispatch({ type: 'SET_VIEW', payload: 'wizard' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfc] text-stone-900 font-sans selection:bg-amber-200">
      {/* Decorative Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-stone-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-stone-800">
          <Book className="w-6 h-6 text-amber-600" />
          <span className="font-serif font-bold text-xl tracking-tight">D&D 5e Toolkit</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-stone-600">
          <a href="#" className="hover:text-amber-600 transition-colors">工具箱</a>
          <a href="#" className="hover:text-amber-600 transition-colors">致谢</a>
          <a href="https://github.com/littlhMW/DND5eCharacterTools-" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-stone-900 transition-colors">
            <Github size={16} /> GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-32 relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center -z-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-100 rounded-full blur-[120px] opacity-30 -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl w-full text-center space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-stone-600 font-medium text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            基于 5etools 数据与 FVTT-CN 翻译
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-stone-900 tracking-tight font-serif leading-[1.1]">
            铸就属于你的<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-500">传奇史诗</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Dungeons & Dragons 5e 角色创建与管理平台。流线型向导设计，包含种族、职业、法术与属性分配的一站式体验。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartCreation}
              className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-md font-medium text-lg hover:bg-stone-800 transition-colors shadow-xl shadow-stone-900/10 w-full sm:w-auto justify-center group"
            >
              <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              立刻创建角色
            </motion.button>
            <button className="flex items-center gap-2 px-8 py-4 bg-white text-stone-900 border border-stone-200 rounded-md font-medium text-lg hover:border-stone-300 hover:bg-stone-50 transition-colors w-full sm:w-auto justify-center">
              浏览数据参考
            </button>
          </div>
        </motion.div>

        {savedChars.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mt-24 text-left"
          >
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2 border-b border-stone-200 pb-4">
              <User size={24} className="text-amber-600" />
              本地角色档案库
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedChars.map((char: any, idx: number) => {
                const cls = classes.find(c => c.id === char.classId);
                const race = races.find(r => r.id === char.raceId);
                const currentCharId = char.id;
                return (
                  <div key={char.id} className="bg-white p-5 rounded-md border border-stone-200 shadow-sm hover:border-amber-300 transition-colors group cursor-pointer relative" onClick={() => dispatch({ type: 'LOAD_CHARACTER', payload: char })}>
                    {deletingId === currentCharId && (
                      <div className="absolute inset-0 bg-stone-900/95 text-white flex flex-col items-center justify-center p-5 rounded-md z-30 animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                        <span className="text-sm font-semibold mb-3 text-stone-200">确定要删除这个角色吗？</span>
                        <div className="flex gap-4">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const newChars = savedChars.filter((item: any) => item.id !== currentCharId);
                              setSavedChars(newChars);
                              localStorage.setItem('dndChars', JSON.stringify(newChars));
                              setDeletingId(null);
                            }}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded transition-colors"
                          >
                            确认删除
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeletingId(null);
                            }}
                            className="px-4 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 font-medium text-xs rounded transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    )}
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-amber-700">{char.name || '未命名'}</h3>
                    <button 
                      className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition-colors p-1 z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeletingId(currentCharId);
                      }}
                      title="删除角色"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                    <p className="text-sm text-stone-500 mt-1 mb-4 flex items-center gap-2">
                       <span className="inline-block bg-stone-100 px-2 py-0.5 rounded text-xs">Lv {char.level || 1}</span>
                       <span>{race?.name || '未知种族'}</span>
                       <span>{cls?.name || '无职业'}</span>
                    </p>
                    <button className="text-sm font-medium text-amber-600 hover:text-amber-700 w-full bg-amber-50 hover:bg-amber-100 py-2 rounded-lg transition-colors">
                      加载角色卡
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-32"
        >
          <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-md flex items-center justify-center text-amber-600 border border-amber-100">
              <Scroll size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">核心规则全覆盖</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              内建 5e 玩家手册的核心种族、职业与背景支持。清晰直观的法术筛选及豁免计算。
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center text-blue-600 border border-blue-100">
              <Wand2 size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-900">自动属性推源</h3>
            <p className="text-stone-600 leading-relaxed text-sm">
              掷骰或购点自动计算属性值、调整值以及熟练加值。支持职业特性的智能推送与法术位管理。
            </p>
          </div>
          <div className="bg-stone-50 p-8 rounded-lg border border-dashed border-stone-300 flex flex-col gap-4 opacity-70">
            <div className="w-12 h-12 bg-stone-200 rounded-md flex items-center justify-center text-stone-600 border border-stone-300">
              <Shield size={24} />
            </div>
            <h3 className="font-serif font-bold text-xl text-stone-500">即将推出: 导出表格</h3>
            <p className="text-stone-500 leading-relaxed text-sm">
              直接导出可用角色卡，在线调整角色卡等功能将在后续更新中陆续加入。
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer & Credits */}
      <footer className="w-full bg-stone-50 border-t border-stone-200 py-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2 space-y-4 text-stone-600 text-sm">
            <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-3 mb-2">
              <Info className="text-amber-600" size={20} />
              <h3 className="text-lg font-serif font-bold text-stone-900">版权说明与致谢</h3>
            </div>
            <p className="leading-relaxed">
              本项目由 <strong className="text-stone-900">littlh</strong> 开发维护。工具底层架构与数据库深度参考了 <a href="https://5e.tools/" target="_blank" rel="noreferrer" className="text-amber-700 hover:underline">5etools</a>。中文本地化文本来自于 <a href="https://github.com/fvtt-cn" target="_blank" rel="noreferrer" className="text-amber-700 hover:underline">FVTT-CN Foundry VTT 中文社区翻译组</a>，感谢所有参与过汉化和维护的无偿贡献者们。
            </p>
            <div className="bg-white p-4 rounded-xl border border-stone-200 text-[13px] leading-relaxed relative">
              <strong className="block text-stone-900 mb-1">使用须知:</strong>
              本工具仅作为辅助参考工具。任何最终的规则结算与法术描述冲突，请以实体出版书籍与官方最新出具的勘误文档为准。
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900">支持与反馈</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <a href="https://github.com/littlhMW/DND5eCharacterTools-/issues" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                  <Github size={16} /> 提交 Bug 与建议
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" /> 服务器状态: 正常
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-stone-900">相关资源</h4>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <a href="https://5e.tools/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                  <ExternalLink size={16} /> 5etools 原库
                </a>
              </li>
              <li>
                <a href="https://github.com/fvtt-cn" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-600 transition-colors">
                  <ExternalLink size={16} /> FVTT-CN 项目
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
