const request = require('request');
const readline = require('readline-sync');
const Table = require('cli-table3');
const chalk = require('chalk');

const createTable = function() {
  return new Table({
    colWidths: [20, 20],
    wordWrap: true
  });
};

const profile = new Table({
  colWidths: [20, 80],
  wordWrap: true
});

const testMatches = createTable();
const odiMatches = createTable();
const t20Matches = createTable();
const firstClassMatches = createTable();

const bowling = new Table({
  head: [
    chalk.blue('Format'),
    chalk.blue('Matches'),
    chalk.blue('WK'),
    chalk.blue('Eco')
  ],
  colWidths: [20, 10, 10, 10],
  wordWrap: true
});

const askPlayerName = function() {
  const playerName = readline.question(
    'Enter name of the player you want to search : '
  );
  return playerName;
};

const getPlayerDetails = function(player, response) {
  const playerIdUrl = `https://cricapi.com/api/playerFinder?apikey=62cC1Nr6dCZEEqAycpQks3S7D0O2&name=${player}`;
  request(playerIdUrl, function(error, res, body) {
    if (error) {
      return 1;
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

const getProfile = function(data) {
  profile.push([{ colSpan: 2, content: chalk.blue('Profile') }]);
  profile.push(['Name', data.name]);
  profile.push(['Country', data.country]);
  profile.push(['Current Age', data.currentAge]);
  profile.push(['Profile', data.profile]);
  profile.push(['Batting Style', data.battingStyle]);
  profile.push(['Bowling Style', data.bowlingStyle]);
  profile.push(['Major Teams', data.majorTeams]);
  profile.push(['Playing Role', data.playingRole]);

  return profile.toString();
};

const getTestMatches = function(data) {
  /* testMatches.push([{ colSpan: 2, content: chalk.blue('Test Matches') }]);
  testMatches.push(['Matches', data.data.batting.tests.Mat]);
  testMatches.push(['Runs', data.data.batting.tests.Runs]);
  testMatches.push(['50s', data.data.batting.tests[50]]);
  testMatches.push(['100s', data.data.batting.tests[100]]);
  testMatches.push(['Ave', data.data.batting.tests.Ave]);
  testMatches.push(['SR', data.data.batting.tests.SR]);
  return testMatches.toString();
  */
};

const getODIMatches = function(data) {
  odiMatches.push([{ colSpan: 2, content: chalk.blue('ODI Matches') }]);
  odiMatches.push(['Matches', data.data.batting.ODIs.Mat]);
  odiMatches.push(['Runs', data.data.batting.ODIs.Runs]);
  odiMatches.push(['50s', data.data.batting.ODIs[50]]);
  odiMatches.push(['100s', data.data.batting.ODIs[100]]);
  odiMatches.push(['Ave', data.data.batting.ODIs.Ave]);
  odiMatches.push(['SR', data.data.batting.ODIs.SR]);

  return odiMatches.toString();
};

const getT20Matches = function(data) {
  t20Matches.push([{ colSpan: 2, content: chalk.blue('T20I Matches') }]);
  t20Matches.push(['Matches', data.data.batting.T20Is.Mat]);
  t20Matches.push(['Runs', data.data.batting.T20Is.Runs]);
  t20Matches.push(['50s', data.data.batting.T20Is[50]]);
  t20Matches.push(['100s', data.data.batting.T20Is[100]]);
  t20Matches.push(['Ave', data.data.batting.T20Is.Ave]);
  t20Matches.push(['SR', data.data.batting.T20Is.SR]);

  return t20Matches.toString();
};

const getFirstClassMatches = function(data) {
  firstClassMatches.push([
    { colSpan: 2, content: chalk.blue('First Class Matches') }
  ]);

  firstClassMatches.push(['Matches', data.data.batting.firstClass.Mat]);
  firstClassMatches.push(['Runs', data.data.batting.firstClass.Runs]);
  firstClassMatches.push(['50s', data.data.batting.firstClass[50]]);
  firstClassMatches.push(['100s', data.data.batting.firstClass[100]]);
  firstClassMatches.push(['Ave', data.data.batting.firstClass.Ave]);
  firstClassMatches.push(['SR', data.data.batting.firstClass.SR]);

  return firstClassMatches.toString();
};

const getBowlingData = function(data) {
  bowling.push([
    'Tests',
    data.data.bowling.tests.Mat,
    data.data.bowling.tests.Wkts,
    data.data.bowling.tests.Econ
  ]);
  bowling.push([
    'ODIs',
    data.data.bowling.ODIs.Mat,
    data.data.bowling.ODIs.Wkts,
    data.data.bowling.ODIs.Econ
  ]);
  bowling.push([
    'ODIs',
    data.data.bowling.T20Is.Mat,
    data.data.bowling.T20Is.Wkts,
    data.data.bowling.T20Is.Econ
  ]);
  bowling.push([
    'First Class',
    data.data.bowling.firstClass.Mat,
    data.data.bowling.firstClass.Wkts,
    data.data.bowling.firstClass.Econ
  ]);

  return bowling.toString();
};

const formatDetails = function(data) {
  const profile = getProfile(data);
  const testMatches = getTestMatches(data);
  const odiMatches = getODIMatches(data);
  const t20Matches = getT20Matches(data);
  const firstClassMatches = getFirstClassMatches(data);
  const bowling = getBowlingData(data);

  console.log(profile);
  console.log(testMatches);
  console.log(odiMatches);
  console.log(t20Matches);
  console.log(firstClassMatches);
  console.log(bowling);
};

const main = function() {
  let playerName = askPlayerName();
  getPlayerDetails(playerName);
};

module.exports = {
  getPlayerDetails
};
