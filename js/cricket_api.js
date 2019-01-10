const request = require('request');

const getPlayerDetails = function(player, response) {
  const playerIdUrl = `https://cricapi.com/api/playerFinder?apikey=62cC1Nr6dCZEEqAycpQks3S7D0O2&name=${player}`;
  request(playerIdUrl, function(error, res, body) {
    if (error) {
      return 1;
    }
    if (JSON.parse(body).data[0] == undefined) {
      response.writeHead(404, { 'content-type': 'text/html' });
      response.write('Player not found!');
      return response.end();
    }
    const pid = JSON.parse(body).data[0].pid;
    return getDetails(pid, response);
  });
};

const getDetails = function(playerID, response) {
  const playerDetailsUrl = `https://cricapi.com/api/playerStats?apikey=62cC1Nr6dCZEEqAycpQks3S7D0O2&pid=${playerID}`;
  request(playerDetailsUrl, function(error, res, body) {
    if (error) {
      return 1;
    }

    response.writeHead(200, { 'content-type': 'text/html' });
    const playerData = JSON.parse(body);
    console.log(playerData);
    let pageHead = `<!DOCTYPE html>
<html>
  <head>
    <title>${playerData.name} - Crikipedia</title>
    <link rel="stylesheet" type="text/css" href="style/profile_style.css" />
  </head>`;

    let pageBody = `<body>
    <div class="header">
      <img
        class="profile_pic"
        src="${playerData.imageURL}"
        alt="Profile Pic"
      />
      <div class="identity_container">
        <h1 class="player_name">${playerData.name}</h1>
        <h3 class="player_country">${playerData.country}</h3>
      </div>
    </div>`;

    pageBody += `<div class="info_container">
      <div class="personal_info_container">
        <h4 class="title">Personal Information</h4>
        <table class="personal_info">
          <tbody>
            <tr class="data_row">
              <td class="label">Born</td>
              <td>${playerData.born
                .split(' ')
                .slice(0, 3)
                .join(' ')}</td>
            </tr>
            <tr class="data_row">
              <td class="label">Birth Place</td>
              <td>${playerData.born
                .split(' ')
                .slice(3)
                .join(' ')}</td>
            </tr>
            <tr class="data_row">
              <td class="label">Role</td>
              <td>${playerData.playingRole}</td>
            </tr>
            <tr class="data_row">
              <td class="label">Batting Style</td>
              <td>${playerData.battingStyle}</td>
            </tr>
            <tr class="data_row">
              <td class="label">Bowling Style</td>
              <td>${playerData.bowlingStyle}</td>
            </tr>
          </tbody>
        </table>
      </div>`;

    pageBody += `<div class="professional_info_container">
        <div class="profile_container">
          <h4 class="title">Profile</h4>
          <p class="profile">
            ${playerData.profile}
          </p>
        </div>`;

    pageBody += `<div class="records_container">
          <h4 class="title">Batting Career Summary</h4>
          <table class="records">
            <thead>
              <tr>
                <th></th>
                <th>M</th>
                <th>Inn</th>
                <th>Runs</th>
                <th>Ave</th>
                <th>SR</th>
                <th>100</th>
                <th>50</th>
                <th>4s</th>
                <th>6s</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="label">Test</td>
                <td>${playerData.data.batting.tests.Mat}</td>
                <td>${playerData.data.batting.tests.Inns}</td>
                <td>${playerData.data.batting.tests.Runs}</td>
                <td>${playerData.data.batting.tests.Ave}</td>
                <td>${playerData.data.batting.tests.SR}</td>
                <td>${playerData.data.batting.tests[100]}</td>
                <td>${playerData.data.batting.tests[50]}</td>
                <td>${playerData.data.batting.tests['4s']}</td>
                <td>${playerData.data.batting.tests['6s']}</td>
              </tr>`;

    pageBody += `<tr>
                <td class="label">ODI</td>
                <td>${playerData.data.batting.ODIs.Mat}</td>
                <td>${playerData.data.batting.ODIs.Inns}</td>
                <td>${playerData.data.batting.ODIs.Runs}</td>
                <td>${playerData.data.batting.ODIs.Ave}</td>
                <td>${playerData.data.batting.ODIs.SR}</td>
                <td>${playerData.data.batting.ODIs[100]}</td>
                <td>${playerData.data.batting.ODIs[50]}</td>
                <td>${playerData.data.batting.ODIs['4s']}</td>
                <td>${playerData.data.batting.ODIs['6s']}</td>
              </tr>`;

    pageBody += `<tr>
                <td class="label">T20I</td>
                <td>${playerData.data.batting.T20Is.Mat}</td>
                <td>${playerData.data.batting.T20Is.Inns}</td>
                <td>${playerData.data.batting.T20Is.Runs}</td>
                <td>${playerData.data.batting.T20Is.Ave}</td>
                <td>${playerData.data.batting.T20Is.SR}</td>
                <td>${playerData.data.batting.T20Is[100]}</td>
                <td>${playerData.data.batting.T20Is[50]}</td>
                <td>${playerData.data.batting.T20Is['4s']}</td>
                <td>${playerData.data.batting.T20Is['6s']}</td>
              </tr>`;

    pageBody += `<tr>
                <td class="label">FC</td>
                <td>${playerData.data.batting.firstClass.Mat}</td>
                <td>${playerData.data.batting.firstClass.Inns}</td>
                <td>${playerData.data.batting.firstClass.Runs}</td>
                <td>${playerData.data.batting.firstClass.Ave}</td>
                <td>${playerData.data.batting.firstClass.SR}</td>
                <td>${playerData.data.batting.firstClass[100]}</td>
                <td>${playerData.data.batting.firstClass[50]}</td>
                <td>${playerData.data.batting.firstClass['4s']}</td>
                <td>${playerData.data.batting.firstClass['6s']}</td>
              </tr> 
              </tbody>
          </table>`;

    pageBody += `<h4 class="title records_container">Bowling Career Summary</h4>
          <table class="records">
            <thead>
              <tr>
                <th></th>
                <th>M</th>
                <th>Inn</th>
                <th>B</th>
                <th>Runs</th>
                <th>Wkts</th>
                <th>BBI</th>
                <th>BBM</th>
                <th>Econ</th>
                <th>Avg</th>
                <th>SR</th>
                <th>5W</th>
                <th>10W</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="label">Test</td>
                <td>${playerData.data.bowling.tests.Mat}</td>
                <td>${playerData.data.bowling.tests.Inns}</td>
                <td>${playerData.data.bowling.tests.Balls}</td>
                <td>${playerData.data.bowling.tests.Runs}</td>
                <td>${playerData.data.bowling.tests.Wkts}</td>
                <td>${playerData.data.bowling.tests.BBI}</td>
                <td>${playerData.data.bowling.tests.BBM}</td>
                <td>${playerData.data.bowling.tests.Econ}</td>
                <td>${playerData.data.bowling.tests.Ave}</td>
                <td>${playerData.data.bowling.tests.SR}</td>
                <td>${playerData.data.bowling.tests['5w']}</td>
                <td>${playerData.data.bowling.tests[10]}</td>
              </tr>
              <tr>
                <td class="label">ODI</td>
                <td>${playerData.data.bowling.ODIs.Mat}</td>
                <td>${playerData.data.bowling.ODIs.Inns}</td>
                <td>${playerData.data.bowling.ODIs.Balls}</td>
                <td>${playerData.data.bowling.ODIs.Runs}</td>
                <td>${playerData.data.bowling.ODIs.Wkts}</td>
                <td>${playerData.data.bowling.ODIs.BBI}</td>
                <td>${playerData.data.bowling.ODIs.BBM}</td>
                <td>${playerData.data.bowling.ODIs.Econ}</td>
                <td>${playerData.data.bowling.ODIs.Ave}</td>
                <td>${playerData.data.bowling.ODIs.SR}</td>
                <td>${playerData.data.bowling.ODIs['5w']}</td>
                <td>${playerData.data.bowling.ODIs[10]}</td>
              </tr>
              <tr>
                <td class="label">T20I</td>
                <td>${playerData.data.bowling.T20Is.Mat}</td>
                <td>${playerData.data.bowling.T20Is.Inns}</td>
                <td>${playerData.data.bowling.T20Is.Balls}</td>
                <td>${playerData.data.bowling.T20Is.Runs}</td>
                <td>${playerData.data.bowling.T20Is.Wkts}</td>
                <td>${playerData.data.bowling.T20Is.BBI}</td>
                <td>${playerData.data.bowling.T20Is.BBM}</td>
                <td>${playerData.data.bowling.T20Is.Econ}</td>
                <td>${playerData.data.bowling.T20Is.Ave}</td>
                <td>${playerData.data.bowling.T20Is.SR}</td>
                <td>${playerData.data.bowling.T20Is['5w']}</td>
                <td>${playerData.data.bowling.T20Is[10]}</td>
              </tr>
              <tr>
                <td class="label">FC</td>
                <td>${playerData.data.bowling.firstClass.Mat}</td>
                <td>${playerData.data.bowling.firstClass.Inns}</td>
                <td>${playerData.data.bowling.firstClass.Balls}</td>
                <td>${playerData.data.bowling.firstClass.Runs}</td>
                <td>${playerData.data.bowling.firstClass.Wkts}</td>
                <td>${playerData.data.bowling.firstClass.BBI}</td>
                <td>${playerData.data.bowling.firstClass.BBM}</td>
                <td>${playerData.data.bowling.firstClass.Econ}</td>
                <td>${playerData.data.bowling.firstClass.Ave}</td>
                <td>${playerData.data.bowling.firstClass.SR}</td>
                <td>${playerData.data.bowling.firstClass['5w']}</td>
                <td>${playerData.data.bowling.firstClass[10]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</html>`;

    response.write(pageHead + pageBody);
    return response.end();
  });
};

module.exports = {
  getPlayerDetails
};
