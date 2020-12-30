import { event } from 'jquery';
import { html } from 'lit-html';
import moment from 'moment';
import downIcon from '../img/down.svg'
import upIcon from '../img/up.svg'

require('lodash/fp');
const axios = require('axios').default;

// Render
const dispatchRender = () => {
  const ce = new CustomEvent('update-render', {
    bubbles: true
  });
  document.dispatchEvent(ce);
}

var data = '';
var openCageData = '';
var geoPlace = '';

// Logica search
var str;
const doSearch = (event) => {
  event.preventDefault()
  str = event.target.value.toLowerCase();

  const ce = new CustomEvent('usersearch', {
    bubbles: true,
    detail: str
  });
  document.dispatchEvent(ce);
}

// Geolocation search info
function checkLocation() {
  let puffContainer = document.getElementById('puffContainer')
  let locationNotFound = document.getElementById('locationNotFound')
  var buttonGood = document.getElementById('good')
  var buttonModerate = document.getElementById('moderate')
  var buttonUS = document.getElementById('unhealtySensitive')
  var buttonUnhealty = document.getElementById('unhealty')
  var buttonVU = document.getElementById('veryUnhealty')
  var buttonHazardous = document.getElementById('hazardous')

  buttonGood.classList.add('puff')
  buttonModerate.classList.add('puff')
  buttonUS.classList.add('puff')
  buttonUnhealty.classList.add('puff')
  buttonVU.classList.add('puff')
  buttonHazardous.classList.add('puff')

  if (locationNotFound.classList.contains('locationNotFound')) {
    locationNotFound.classList.add('puff')
  }

  axios.get('https://api.waqi.info/feed/' + `${str}` + '/?token=' + `${process.env.WAQI_TOKEN}`)

    .then(function (response) {
      // handle success
      data = response.data.data

      if (response.data.data === "Unknown station") {
        locationNotFound.classList.remove('puff')
        puffContainer.classList.add('puff')
      } else {
        puffContainer.classList.remove('puff')


        if (data.aqi === 0 || data.aqi <= 50) {
          buttonGood.classList.remove('puff')
        }
        if (data.aqi >= 51 || data.aqi === 100) {
          buttonModerate.classList.remove('puff')
        }
        if (data.aqi >= 101 || data.aqi === 150) {
          buttonUS.classList.remove('puff')
        }
        if (data.aqi >= 151 || data.aqi === 200) {
          buttonUnhealty.classList.remove('puff')
        }
        if (data.aqi >= 201 || data.aqi === 300) {
          buttonVU.classList.remove('puff')
        }
        if (data.aqi >= 300) {
          buttonHazardous.classList.remove('puff')

        }
      }

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {

      dispatchRender();

    })

}

// Geolocation
navigator.geolocation.getCurrentPosition(function (position) {
  var location;
  var buttonGood = document.getElementById('good')
  var buttonModerate = document.getElementById('moderate')
  var buttonUS = document.getElementById('unhealtySensitive')
  var buttonUnhealty = document.getElementById('unhealty')
  var buttonVU = document.getElementById('veryUnhealty')
  var buttonHazardous = document.getElementById('hazardous')

  axios.get('https://api.opencagedata.com/geocode/v1/json' + '?' + `key=${process.env.OPEN_TOKEN}` + '&q=' + encodeURIComponent(position.coords.latitude + ',' + position.coords.longitude) + '&pretty=1'
    + '&no_annotations=1')
    .then((response) => {

      openCageData = response.data

      geoPlace = `${_.get(openCageData, 'results[0].components.town') || _.get(openCageData, 'results[0].components.city') || _.get(openCageData, 'results[0].components.province')}`


      if (geoPlace === `${_.get(openCageData, 'results[0].components.town') || _.get(openCageData, 'results[0].components.city') || _.get(openCageData, 'results[0].components.province')}`) {

        location = geoPlace

        axios.get('https://api.waqi.info/feed/' + `${location}` + '/?token=' + `${process.env.WAQI_TOKEN}`)
          .then(function (response) {
            // handle success
            data = response.data.data

            if (response.data.data === "Unknown station") {
              console.log(response.data.data)
            } else {
              puffContainer.classList.remove('puff')

              if (data.aqi === 0 || data.aqi <= 50) {
                buttonGood.classList.remove('puff')
              }
              if (data.aqi >= 51 || data.aqi === 100) {
                buttonModerate.classList.remove('puff')
              }
              if (data.aqi >= 101 || data.aqi === 150) {
                buttonUS.classList.remove('puff')
              }
              if (data.aqi >= 151 || data.aqi === 200) {
                buttonUnhealty.classList.remove('puff')
              }
              if (data.aqi >= 201 || data.aqi === 300) {
                buttonVU.classList.remove('puff')
              }
              if (data.aqi >= 300) {
                buttonHazardous.classList.remove('puff')

              }

            }

          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(function () {

            dispatchRender();

          })
      }
    })
});


// Render in page
const body = () => html`
  <div id="locationNotFound" class="puff locationNotFound">
    <h2>The selected location is not available</h2>
  </div>
  
  <div id="puffContainer" class="puff">
  
    <div class="dataInfo">
      <h2>${_.get(data, 'city.name', 0)}</h2>
      <p>Data provided ${moment(_.get(data, 'debug.sync', 0), "YYYYMMDD").fromNow()}</p>
    </div>
  
    <div class="dataDisplay">
      <div class="dataDisplayAqi">
        <h3> Air quality score</h3>
        <h3>${_.get(data, 'aqi', 0)}</h3>
        <button id="unhealtySensitive" type="button" class="puff unhealtySensitive btn btn-primary">Unhealthy for
          Sensitive Groups</button>
        <button id="veryUnhealty" type="button" class="puff veryUnhealty btn btn-secondary">Very Unhealthy</button>
        <button id="good" type="button" class="puff good btn btn-success">Good</button>
        <button id="unhealty" type="button" class="puff unhealty btn btn-danger">Unhealthy</button>
        <button id="moderate" type="button" class="puff moderate btn btn-warning">Moderate</button>
        <button id="hazardous" type="button" class="puff hazardous btn btn-info">Hazardous</button>
        <div class="content">
          <p>La qualità dell'aria è una misura di quanto l'aria sia libera da inquinamento atmosferico e innocua se
            respirata dall'uomo.</p>
        </div>
  
      </div>
  
      <div class="dataDisplayInfos">
        <div class="dataCont">
          <h3>O3</h3>
          <p><img src=${downIcon} alt="" /> ${_.get(data, 'forecast.daily.o3[1].avg', 0)}</p>
          <p><img src=${upIcon} alt="" /> ${_.get(data, 'forecast.daily.o3[1].max', 0)}</p>
  
          <div class="content">
            <p>Gli impatti principali dell'inquinamento da ozono sono a carico della salute umana.
              Il bersaglio prevalente dell' O3 è l'apparato respiratorio. Una prolungata esposizione
              all'ozono può provocare la diminuzione della crescita della vegetazione e può incidere,
              inoltre, sulla vitalità delle piante sensibili.
            </p>
          </div>
  
        </div>
  
        <div class="dataCont">
          <h3>pm25</h3>
          <p><img src=${downIcon} alt="" /> ${_.get(data, 'forecast.daily.pm25[1].avg', 0)}</p>
          <p><img src=${upIcon} alt="" /> ${_.get(data, 'forecast.daily.pm25[1].max', 0)}</p>
          <div class="content">
            <p>
              Per materiale particolato aerodisperso si intende l'insieme delle particelle atmosferiche
              solide e liquide sospese in aria ambiente. Il termine PM2,5 identifica le particelle di
              diametro aerodinamico inferiore o uguale ai 2,5 µm.
            </p>
          </div>
        </div>
        <div class="dataCont">
          <h3>pm10</h3>
          <p><img src=${downIcon} alt="" /> ${_.get(data, 'forecast.daily.pm10[1].avg', 0)}</p>
          <p><img src=${upIcon} alt="" /> ${_.get(data, 'forecast.daily.pm10[1].max', 0)}</p>
          <div class="content content--right">
            <p>
              Per materiale particolato aerodisperso si intende l'insieme delle particelle atmosferiche solide
              e liquide sospese in aria ambiente. Il termine PM1,0 identifica le particelle di diametro aerodinamico
              inferiore o uguale ai 1,0 µm.
            </p>
          </div>
        </div>
  
      </div>
    </div>
  
  
    <div class="dataDisplay">
  
      <div class="dataDisplayInfos">
        <div class="dataCont dataCont--secLine">
          <h3>co</h3>
          <p>${_.get(data, 'iaqi.co.v', 0)}</p>
          <div class="content">
            <p>
              Il monossido di carbonio (CO) fra gli inquinanti gassosi è il più abbondante in atmosfera.
              È un gas inodore e incolore ed è generato durante la combustione di materiali organici
              quando la quantità di ossigeno a disposizione è insufficiente.
              La principale sorgente di CO è rappresentata dal traffico veicolare.
            </p>
          </div>
        </div>
        <div class="dataCont dataCont--secLine">
          <h3>h</h3>
          <p>${_.get(data, 'iaqi.h.v', 0)}</p>
        </div>
        <div class="dataCont dataCont--secLine ">
          <h3>so2</h3>
          <p>${_.get(data, 'iaqi.so2.v', 0)}</p>
          <div class="content content--right">
            <p>
              La SO2 è un gas incolore e irritante, è uno degli inquinanti atmosferici tra i più aggressivi e
              pericolosi.
              Il biossido di zolfo (SO2) è l'inquinante primario più importante e scaturisce principalmente
              dall'ossidazione dello zolfo nei processi di combustione di carbone, petrolio e gasolio.
            </p>
          </div>
        </div>
      </div>
  
      <div class="dataDisplayInfos">
        <div class="dataCont dataCont--secLine ">
          <h3>no2</h3>
          <p>${_.get(data, 'iaqi.no2.v', 0)}</p>
          <div class="content">
            <p>
              Il biossido di azoto (NO2) è un inquinante che viene normalmente generato a seguito di processi di
              combustione. In particolare, tra le sorgenti emissive, il traffico veicolare è stato individuato
              essere quello che contribuisce maggiormente all'aumento dei livelli di biossido d'azoto nell'aria
              ambiente.
            </p>
          </div>
        </div>
        <div class="dataCont">
          <h3>Temp</h3>
          <p>${_.get(data, 'iaqi.t.v', 0)} °C</p>
        </div>
      </div>
  
    </div>
    <div class="dataFont">
      <p>Fonte: ${_.get(data, 'attributions.[0].name', 0)}</p>
      <a target="_blank" href="https://www.arpalombardia.it/"><img
          src="https://www.arpalombardia.it/PublishingImages/arpa-facebook.png" alt="" /></a>
    </div>
  </div>

`

export {
  body,
  doSearch,
  checkLocation
}


