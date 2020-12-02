import axios from 'axios';
import mapboxgl from 'mapbox-gl';

const center = [-122.27108, 37.55855]; // Foster City, CA
const zoom = 13;

const minYear = 1960;
const maxYear = 2020;

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const getRandomYearFromRange = () => {
  return Math.round(Math.random() * (maxYear - minYear)) + minYear;
};

export const pipeGroupNames = ['year', 'diameter', 'material'];

export const get_random_color = () => {
  let hex = Math.round(Math.random() * 0xffffff).toString(16);
  while (hex.length < 6) hex = `0${hex}`;
  return `#${hex}`;
};

export const getPipeDataByGroupName = (groupName, pipeData, pipeGroups) => {
  const group = pipeGroups[groupName]; // object of values with same groupName value
  if (group) {
    Object.keys(group).forEach((value) => {
      group[value].indexes.forEach((index) => {
        pipeData.features[index].properties.color = group[value].color;
      });
    });
  }
  return pipeData;
};

export const getGroupContentByName = (groupName, pipeGroups) => {
  const group = pipeGroups[groupName];
  if (group) {
    return Object.keys(group).reduce((ret, value) => {
      ret.push({ color: group[value].color, value });
      return ret;
    }, []);
  }
  return [];
};

export const getPipeDataByGroupNameAndValue = (
  groupName,
  pipeData,
  pipeGroups,
  value
) => {
  const group = pipeGroups[groupName];
  if (group && group[value]) {
    group[value].indexes.forEach((index) => {
      pipeData.features[index].properties.color = group[value].color;
    });
  }
  return pipeData;
};

export const resetPipeData = (pipeData) => {
  pipeData.features.forEach((data) => {
    if (data.properties && data.properties.color) {
      delete data.properties.color;
    }
  });
  return pipeData;
};

export const getPipeGroups = (features = []) => {
  return features.reduce((ret, item, index) => {
    pipeGroupNames.forEach((groupName) => {
      const key = Object.keys(item.properties).find(
        (prop) => prop.toLowerCase().indexOf(groupName.toLowerCase()) > -1
      );
      ret[groupName] = ret[groupName] || {};
      const value = item.properties[key];
      ret[groupName][value] = ret[groupName][value] || {};
      if (typeof ret[groupName][value].color === 'undefined') {
        ret[groupName][value].color = get_random_color();
      }
      ret[groupName][value].indexes = ret[groupName][value].indexes || [];
      ret[groupName][value].indexes.push(index);
    });
    return ret;
  }, {});
};

export default {
  getPipes() {
    return apiClient.get('/pipes');
  },
  updateMapSource(map, data) {
    map.getSource('lines').setData(data);
  },
  loadDataToMap(map, data) {
    map.on('load', function () {
      map.addSource('lines', {
        type: 'geojson',
        data: data,
      });
      map.addLayer({
        id: 'lines',
        type: 'line',
        source: 'lines',
        paint: {
          'line-width': 5,
          'line-color': ['get', 'color'],
        },
      });
    });
  },
  createMap(mapId) {
    const map = new mapboxgl.Map({
      accessToken:
        'pk.eyJ1IjoiZnJhY3RhdGVzdHMiLCJhIjoiY2tnaWd3NW10MDAzNDJzcnJuNzVrNGd5cSJ9.6pV_QFxNJE22pj4-uKCjpQ',
      container: mapId,
      style: 'mapbox://styles/mapbox/streets-v11',
      minzoom: 5,
      center: center,
      zoom: zoom,
      hash: true,
    });
    return map;
  },
};
