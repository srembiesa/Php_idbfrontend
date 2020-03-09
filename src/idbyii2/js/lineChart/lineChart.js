/**
 # * ********************************************************************* *
 # *                                                                       *
 # *   Front end for IDB web portals                                       *
 # *   This file is part of idbfrontend. This project may be found at:     *
 # *   https://github.com/IdentityBank/Php_idbfrontend.                    *
 # *                                                                       *
 # *   Copyright (C) 2020 by Identity Bank. All Rights Reserved.           *
 # *   https://www.identitybank.eu - You belong to you                     *
 # *                                                                       *
 # *   This program is free software: you can redistribute it and/or       *
 # *   modify it under the terms of the GNU Affero General Public          *
 # *   License as published by the Free Software Foundation, either        *
 # *   version 3 of the License, or (at your option) any later version.    *
 # *                                                                       *
 # *   This program is distributed in the hope that it will be useful,     *
 # *   but WITHOUT ANY WARRANTY; without even the implied warranty of      *
 # *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the        *
 # *   GNU Affero General Public License for more details.                 *
 # *                                                                       *
 # *   You should have received a copy of the GNU Affero General Public    *
 # *   License along with this program. If not, see                        *
 # *   https://www.gnu.org/licenses/.                                      *
 # *                                                                       *
 # * ********************************************************************* *
 */

import Chart from 'chart.js';

let chartData = JSON.parse(data);

function getLabels(data) {
    const labels = [];
    for (let type in data) {
        for (let label in data[type]) {
            labels.push(label);
        }
        break;
    }

    return labels;
}

function getDataSets(data) {
    let typeData = [];
    for (let key in data) {
        let r = Math.floor((Math.random() * 255) + 1);
        let g = Math.floor((Math.random() * 255) + 1);
        let b = Math.floor((Math.random() * 255) + 1);
        console.log(`rgba(${r}, ${g}, ${b}, 1)`);
        let type = {
            label: key,
            backgroundColor: `rgba(${r}, ${g}, ${b}, 0.8)`,
            fillColor: `rgba(${r}, ${g}, ${b}, 0.8)`,
            strokeColor: `rgba(${r}, ${g}, ${b}, 0.8)`,
            pointColor: `rgba(${r}, ${g}, ${b}, 0.8)`,
            pointStrokeColor: `rgba(${r}, ${g}, ${b}, 0.8)`,
            pointHighlightFill: `rgba(${r}, ${g}, ${b}, 0.8)`,
            pointHighlightStroke: `rgba(${r}, ${g}, ${b},0.8)`,
            data: []
        };

        for (let day in data[key]) {
            type.data.push(data[key][day]);
        }

        typeData.push(type);
    }

    return typeData;
}


const lineChartData = {
    labels: getLabels(chartData),
    datasets: getDataSets(chartData)
};

const lineChartOptions = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

const lineChartCanvas = $('#' + id + ' canvas').get(0).getContext('2d');
const lineChart = new Chart(lineChartCanvas, {
    type: 'line',
    data: lineChartData,
    options: lineChartOptions
});

/**
 ################################################################################
 #                                End of file                                   #
 ################################################################################
 */
