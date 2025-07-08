import React, { useState, useEffect, useCallback } from 'react';
import { Award, Rabbit, Fish, Bird, Mountain, Trees, Droplets, Waves, Wheat, RefreshCw, PawPrint, Squirrel } from 'lucide-react';

// --- Helper Data & Functions ---
const wildlifeTypes = [
    { name: 'หมี (Bear)', icon: <PawPrint className="w-6 h-6 text-yellow-700" />, key: 'bear' },
    { name: 'กวางเอลค์ (Elk)', icon: <Rabbit className="w-6 h-6 text-green-700" />, key: 'elk' },
    { name: 'ปลาแซลมอน (Salmon)', icon: <Fish className="w-6 h-6 text-red-600" />, key: 'salmon' },
    { name: 'เหยี่ยว (Hawk)', icon: <Bird className="w-6 h-6 text-blue-600" />, key: 'hawk' },
    { name: 'สุนัขจิ้งจอก (Fox)', icon: <Squirrel className="w-6 h-6 text-orange-600" />, key: 'fox' },
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

const ScoreInput = ({ label, value, onChange, icon }) => (
    <div className="flex items-center justify-between space-x-2 w-full">
        <div className="flex items-center space-x-3">
            {icon}
            <label className="text-gray-600 text-sm md:text-base">{label}</label>
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
);

const PlayerCard = ({ player, playerId, updateScore, isWinner }) => {
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
                    <div className="space-y-2">
                        {wildlifeTypes.map((animal) => (
                            <ScoreInput
                                key={animal.key}
                                icon={animal.icon}
                                label={animal.name}
                                value={player.scores.wildlife[animal.key]}
                                onChange={(e) => handleScoreChange('wildlife', animal.key, e.target.value)}
                            />
                        ))}
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
                        icon={<div className="w-6 h-6 flex items-center justify-center"><span className="text-lg text-emerald-600">🌲</span></div>}
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

    const createInitialPlayers = useCallback((count) => {
        return Array.from({ length: count }, () =>
            JSON.parse(JSON.stringify(initialPlayerState))
        );
    }, []);
    
    // Initialize players when numPlayers changes
    useEffect(() => {
        setPlayers(createInitialPlayers(numPlayers));
        setWinners([]);
    }, [numPlayers, createInitialPlayers]);

    // Update score and recalculate total
    const updateScore = useCallback((playerId, category, type, value) => {
        setPlayers(prevPlayers => {
            const newPlayers = [...prevPlayers];
            const player = newPlayers[playerId];

            if (category === 'natureTokens') {
                player.scores.natureTokens = value;
            } else {
                player.scores[category][type] = value;
            }

            // Recalculate total score for the updated player
            const wildlifeTotal = Object.values(player.scores.wildlife).reduce((sum, score) => sum + score, 0);
            const habitatTotal = Object.values(player.scores.habitat).reduce((sum, score) => sum + score, 0);
            player.totalScore = wildlifeTotal + habitatTotal + player.scores.natureTokens;

            return newPlayers;
        });
    }, []);

    // Determine winner(s)
    useEffect(() => {
        if (players.length === 0) {
            setWinners([]);
            return;
        }

        const maxScore = players.reduce((max, p) => p.totalScore > max ? p.totalScore : max, -1);

        if (maxScore === 0) {
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


    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800">Cascadia</h1>
                    <p className="text-lg md:text-xl text-gray-600 mt-2">เครื่องคำนวณคะแนน</p>
                </header>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 p-4 bg-white rounded-2xl shadow-md max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                         <label htmlFor="player-count" className="font-semibold text-gray-700">จำนวนผู้เล่น:</label>
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

                {/* Player Cards Grid */}
                {players.length > 0 && (
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8`}>
                        {players.map((player, index) => (
                            <PlayerCard
                                key={index}
                                player={player}
                                playerId={index}
                                updateScore={updateScore}
                                isWinner={winners.includes(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
             <footer className="text-center mt-12 text-gray-500 text-sm">
                <p>สร้างโดย AI สำหรับคนรักบอร์ดเกม</p>
            </footer>
        </div>
    );
}
