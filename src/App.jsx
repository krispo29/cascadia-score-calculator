import React, { useState, useEffect, useCallback } from 'react';
import { Award, Rabbit, Fish, Bird, Mountain, Trees, Droplets, Waves, Wheat, RefreshCw, PawPrint, Squirrel, ChevronDown } from 'lucide-react';

// --- SCORING CARD DATA ---
const WILDLIFE_SCORING_CARDS = {
  bear: {
    A: { name: "หมี A", rule: "นับคะแนนจากหมีที่อยู่เป็นคู่ (2 ตัวติดกัน) คู่ละ 4 คะแนน" },
    B: { name: "หมี B", rule: "นับคะแนนจากหมีที่อยู่เป็นคู่ (2 ตัวติดกัน) โดยจะได้ 4/7/10/13 คะแนน สำหรับ 1/2/3/4 คู่" },
    C: { name: "หมี C", rule: "นับคะแนนจากกลุ่มของหมี โดยจะได้ 2/5/9/13/18 คะแนน สำหรับกลุ่มขนาด 1/2/3/4/5+ ตัว" },
    D: { name: "หมี D", rule: "ได้ 8 คะแนนสำหรับหมีทุกๆ 2 ตัว ที่ไม่ได้อยู่ติดกับหมีตัวอื่น" },
  },
  elk: {
    A: { name: "กวางเอลค์ A", rule: "นับคะแนนจากกลุ่มกวางที่เรียงต่อกันเป็นเส้นตรง โดยจะได้ 2/5/9/13 คะแนน สำหรับเส้นความยาว 1/2/3/4+ ตัว" },
    B: { name: "กวางเอลค์ B", rule: "นับคะแนนจากกลุ่มกวางขนาด 2 ตัว โดยจะได้ 4/6/8/10 คะแนน สำหรับ 1/2/3/4+ กลุ่ม" },
    C: { name: "กวางเอลค์ C", rule: "ได้ 5/8/11 คะแนน สำหรับกลุ่มกวาง 3 ตัวที่เรียงเป็นเส้นตรง 1/2/3+ กลุ่ม" },
    D: { name: "กวางเอลค์ D", rule: "นับคะแนนจากกวางที่ล้อมรอบไทล์อื่นๆ โดยจะได้ 2/4/7/11/15 คะแนน สำหรับกวาง 1/2/3/4/5+ ตัว" },
  },
  salmon: {
    A: { name: "แซลมอน A", rule: "นับคะแนนจากกลุ่มแซลมอนที่เรียงต่อกัน โดยจะได้ 2/5/9/13 คะแนน สำหรับเส้นความยาว 1/2/3/4+ ตัว" },
    B: { name: "แซลมอน B", rule: "ได้ 3/5/8 คะแนนสำหรับกลุ่มแซลมอน 1/2/3+ กลุ่ม โดยในแต่ละกลุ่มต้องมีอย่างน้อย 3 ตัว" },
    C: { name: "แซลมอน C", rule: "นับคะแนนจากกลุ่มแซลมอน โดยจะได้ 3/6/10/15 คะแนน สำหรับกลุ่มขนาด 1/2/3/4+ ตัว" },
    D: { name: "แซลมอน D", rule: "ได้ 7 คะแนน สำหรับทุกๆ 3 ตัวที่ไม่ได้อยู่ติดกับแซลมอนตัวอื่น" },
  },
  hawk: {
    A: { name: "เหยี่ยว A", rule: "ได้ 2/4/7/10 คะแนน สำหรับเหยี่ยว 1/2/3/4+ ตัว ที่ไม่ได้อยู่ติดกับเหยี่ยวตัวอื่น" },
    B: { name: "เหยี่ยว B", rule: "ได้ 4/7/10 คะแนน สำหรับเหยี่ยวที่อยู่แนวทแยงมุมกัน 1/2/3+ คู่" },
    C: { name: "เหยี่ยว C", rule: "ได้ 3/6/9 คะแนน สำหรับเหยี่ยว 1/2/3+ ตัว ที่อยู่เหนือไทล์ชนิดเดียวกัน" },
    D: { name: "เหยี่ยว D", rule: "ได้ 5 คะแนนสำหรับเหยี่ยวทุกตัว ที่อยู่ริมสุดของแผนที่" },
  },
  fox: {
    A: { name: "สุนัขจิ้งจอก A", rule: "ได้ 1 คะแนน สำหรับสุนัขจิ้งจอกแต่ละตัว ที่ล้อมรอบด้วยสัตว์ 3 ชนิดที่แตกต่างกัน" },
    B: { name: "สุนัขจิ้งจอก B", rule: "นับคะแนนจากคู่ของสุนัขจิ้งจอกและสัตว์ชนิดเดียวกันที่อยู่ติดกัน ได้ 3/5/7 คะแนนสำหรับ 1/2/3+ คู่" },
    C: { name: "สุนัขจิ้งจอก C", rule: "ได้ 4/8/12/16 คะแนน สำหรับสุนัขจิ้งจอก 1/2/3/4+ ตัว ที่อยู่ติดกับภูเขา 3 ลูก" },
    D: { name: "สุนัขจิ้งจอก D", rule: "ได้ 3 คะแนน สำหรับสุนัขจิ้งจอกแต่ละตัว ที่ไม่ได้อยู่ติดกับสุนัขจิ้งจอกตัวอื่น" },
  },
};

const wildlifeTypes = [
    { type: 'bear', icon: <PawPrint className="w-8 h-8 text-yellow-700" /> },
    { type: 'elk', icon: <Rabbit className="w-8 h-8 text-green-700" /> },
    { type: 'salmon', icon: <Fish className="w-8 h-8 text-red-600" /> },
    { type: 'hawk', icon: <Bird className="w-8 h-8 text-blue-600" /> },
    { type: 'fox', icon: <Squirrel className="w-8 h-8 text-orange-600" /> },
];

const habitatTypes = [
    { name: 'พื้นที่ป่า (Forest)', icon: <Trees className="w-5 h-5 text-green-600" />, key: 'forest' },
    { name: 'พื้นที่ชุ่มน้ำ (Wetlands)', icon: <Droplets className="w-5 h-5 text-blue-500" />, key: 'wetlands' },
    { name: 'แม่น้ำ (Rivers)', icon: <Waves className="w-5 h-5 text-cyan-500" />, key: 'rivers' },
    { name: 'ทุ่งหญ้า (Prairies)', icon: <Wheat className="w-5 h-5 text-yellow-500" />, key: 'prairies' },
    { name: 'ภูเขา (Mountains)', icon: <Mountain className="w-5 h-5 text-gray-500" />, key: 'mountains' },
];

const initialPlayerState = {
    scores: {
        wildlife: { bear: 0, elk: 0, salmon: 0, hawk: 0, fox: 0 },
        habitat: { forest: 0, wetlands: 0, rivers: 0, prairies: 0, mountains: 0 },
        natureTokens: 0,
    },
    totalScore: 0,
};


// --- Components ---

const ScoringCardSelector = ({ selectedCards, onCardChange }) => (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-center text-teal-800 mb-4">เลือกการ์ดนับคะแนนสัตว์</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {wildlifeTypes.map(({ type, icon }) => (
                <div key={type} className="flex flex-col items-center">
                    <div className="mb-2">{icon}</div>
                    <div className="flex items-center justify-center space-x-1 bg-gray-100 rounded-full p-1">
                        {['A', 'B', 'C', 'D'].map(card => (
                            <button
                                key={card}
                                onClick={() => onCardChange(type, card)}
                                className={`w-9 h-9 text-sm font-bold rounded-full transition-colors ${selectedCards[type] === card ? 'bg-teal-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                {card}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const ScoreInput = ({ label, value, onChange, icon, rule }) => (
    <div>
        <div className="flex items-center justify-between space-x-2 w-full">
            <div className="flex items-center space-x-3">
                {icon}
                <label className="text-gray-700 font-semibold text-sm md:text-base">{label}</label>
            </div>
            <input
                type="number"
                min="0"
                value={value === 0 ? '' : value}
                onChange={onChange}
                placeholder="0"
                className="w-20 p-2 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
        </div>
        {rule && <p className="text-xs text-gray-500 mt-1 pl-9">{rule}</p>}
    </div>
);

const PlayerCard = ({ player, playerId, updateScore, isWinner, selectedCards }) => {
    const handleScoreChange = (category, type, value) => {
        const scoreValue = parseInt(value, 10) || 0;
        updateScore(playerId, category, type, scoreValue);
    };

    return (
        <div className={`relative bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300 ${isWinner ? 'ring-4 ring-amber-400' : 'ring-1 ring-gray-200'}`}>
            {isWinner && (
                <div className="absolute -top-4 -right-4 bg-amber-400 text-white p-2 rounded-full shadow-lg">
                    <Award className="w-6 h-6" />
                </div>
            )}
            <h3 className="text-xl md:text-2xl font-bold text-teal-800 mb-4 text-center">ผู้เล่น {playerId + 1}</h3>

            <div className="space-y-6">
                {/* Wildlife Scores */}
                <div>
                    <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">คะแนนสัตว์ป่า (Wildlife)</h4>
                    <div className="space-y-3">
                        {wildlifeTypes.map(({ type, icon }) => {
                            const cardKey = selectedCards[type];
                            const cardInfo = WILDLIFE_SCORING_CARDS[type][cardKey];
                            return (
                                <ScoreInput
                                    key={type}
                                    icon={icon}
                                    label={cardInfo.name}
                                    rule={cardInfo.rule}
                                    value={player.scores.wildlife[type]}
                                    onChange={(e) => handleScoreChange('wildlife', type, e.target.value)}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Habitat Scores */}
                <div>
                    <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">คะแนนพื้นที่ (Habitat)</h4>
                    <div className="space-y-2">
                        {habitatTypes.map((habitat) => (
                            <ScoreInput
                                key={habitat.key}
                                icon={habitat.icon}
                                label={habitat.name}
                                value={player.scores.habitat[habitat.key]}
                                onChange={(e) => handleScoreChange('habitat', habitat.key, e.target.value)}
                            />
                        ))}
                    </div>
                </div>

                 {/* Nature Tokens */}
                <div>
                    <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">โบนัสอื่น ๆ</h4>
                     <ScoreInput
                        label="โทเคนธรรมชาติ (Nature)"
                        value={player.scores.natureTokens}
                        onChange={(e) => handleScoreChange('natureTokens', null, e.target.value)}
                        icon={<div className="w-6 h-6 flex items-center justify-center"><span className="text-lg text-emerald-600">🍃</span></div>}
                    />
                </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-dashed">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-600">คะแนนรวม</span>
                    <span className="text-3xl font-bold text-teal-600">{player.totalScore}</span>
                </div>
            </div>
        </div>
    );
};


export default function App() {
    const [numPlayers, setNumPlayers] = useState(1);
    const [players, setPlayers] = useState([]);
    const [winners, setWinners] = useState([]);
    const [selectedCards, setSelectedCards] = useState({
        bear: 'A',
        elk: 'A',
        salmon: 'A',
        hawk: 'A',
        fox: 'A',
    });

    const createInitialPlayers = useCallback((count) => {
        return Array.from({ length: count }, () =>
            JSON.parse(JSON.stringify(initialPlayerState))
        );
    }, []);
    
    useEffect(() => {
        setPlayers(createInitialPlayers(numPlayers));
        setWinners([]);
    }, [numPlayers, createInitialPlayers]);

    const updateScore = useCallback((playerId, category, type, value) => {
        setPlayers(prevPlayers => {
            const newPlayers = [...prevPlayers];
            const player = newPlayers[playerId];

            if (category === 'natureTokens') {
                player.scores.natureTokens = value;
            } else {
                player.scores[category][type] = value;
            }

            const wildlifeTotal = Object.values(player.scores.wildlife).reduce((sum, score) => sum + score, 0);
            const habitatTotal = Object.values(player.scores.habitat).reduce((sum, score) => sum + score, 0);
            player.totalScore = wildlifeTotal + habitatTotal + player.scores.natureTokens;

            return newPlayers;
        });
    }, []);

    useEffect(() => {
        if (players.length === 0) return;
        const maxScore = players.reduce((max, p) => p.totalScore > max ? p.totalScore : max, -1);
        if (maxScore <= 0) {
             setWinners([]);
             return;
        }
        const winnerIndices = players
            .map((p, index) => p.totalScore === maxScore ? index : -1)
            .filter(index => index !== -1);
        setWinners(winnerIndices);
    }, [players]);
    
    const resetGame = () => {
        setPlayers(createInitialPlayers(numPlayers));
    };

    const handleCardChange = (animalType, card) => {
        setSelectedCards(prev => ({ ...prev, [animalType]: card }));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800">Cascadia</h1>
                    <p className="text-lg md:text-xl text-gray-600 mt-2">เครื่องคำนวณคะแนน</p>
                </header>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 p-4 bg-white rounded-2xl shadow-md max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                         <label className="font-semibold text-gray-700">จำนวนผู้เล่น:</label>
                         <div className="flex items-center bg-gray-100 rounded-full">
                            {[1, 2, 3, 4].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setNumPlayers(num)}
                                    className={`w-12 h-12 rounded-full text-lg font-bold transition-colors ${numPlayers === num ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {num}
                                </button>
                            ))}
                         </div>
                    </div>
                    <button 
                        onClick={resetGame}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>เริ่มใหม่</span>
                    </button>
                </div>
                
                <ScoringCardSelector selectedCards={selectedCards} onCardChange={handleCardChange} />

                {players.length > 0 && (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8`}>
                        {players.map((player, index) => (
                            <PlayerCard
                                key={index}
                                player={player}
                                playerId={index}
                                updateScore={updateScore}
                                isWinner={winners.includes(index)}
                                selectedCards={selectedCards}
                            />
                        ))}
                    </div>
                )}
            </div>
             <footer className="text-center mt-12 text-gray-500 text-sm">
             
            </footer>
        </div>
    );
}
