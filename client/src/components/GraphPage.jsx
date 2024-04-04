import RunningStatsChart from './RunningStatsChart';
import React, { useState, useMemo } from 'react';
import './GraphPage.css';
import {Navigate} from "react-router-dom";

const GraphPage = ({ data, user }) => {
    console.log('data', data);
    const stats = {'pace': 'min/mile', 'distance': 'miles', 'effort': 'RPE'};
    
    const [type, setType] = useState('all');
    const [stat, setStat] = useState('pace');

    const handleStatChange = (e) => {
        setStat(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const filteredData = useMemo(() => {
        if (type === 'all') {
            return data;
        }
        return data.filter(run => run.type.toLowerCase() === type);
    }, [data, type]);

    console.log('filtered runs', filteredData);

    if (!user) {
        return <Navigate to="/" />;
    }
    
    return (
        <div className='graph-page'>
            <h2>Graph Page</h2>
            <div id="run-dropdowns">
                <div className="dropdown-container">
                    <label htmlFor="statSelect">Select Stat: </label>
                    <select id="statSelect" value={stat} onChange={handleStatChange}>
                        <option value="pace">Pace</option>
                        <option value="effort">Effort</option>
                        <option value="distance">Distance</option>
                    </select>
                </div>
                <div className="dropdown-container">
                    <label htmlFor="typeSelect">Select Type: </label>
                    <select id="typeSelect" value={type} onChange={handleTypeChange}>
                        <option value="all">All Runs</option>
                        <option value="easy">Easy</option>
                        <option value="recovery">Recovery</option>
                        <option value="long">Long</option>
                        <option value="tempo">Tempo</option>
                    </select>
                </div>
            </div>
            <RunningStatsChart data={filteredData} stat={stat} />
        </div>
    );
};

export default GraphPage;
