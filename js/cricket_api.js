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

const getPlayerDetails = function(player) {
  const playerIdUrl = `https://cricapi.com/api/playerFinder?apikey=62cC1Nr6dCZEEqAycpQks3S7D0O2&name=${player}`;
  request(playerIdUrl, function(error, response, body) {
    if (error) {
      return 1;
    }
    const pid = JSON.parse(body).data[0].pid;
    return getDetails(pid);
  });
};

const getDetails = function(playerID) {
  const playerDetailsUrl = `https://cricapi.com/api/playerStats?apikey=62cC1Nr6dCZEEqAycpQks3S7D0O2&pid=${playerID}`;
  request(playerDetailsUrl, function(error, response, body) {
    if (error) {
      return 1;
    }
    formatDetails(JSON.parse(body));
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
  testMatches.push([{ colSpan: 2, content: chalk.blue('Test Matches') }]);
  testMatches.push(['Matches', data.data.batting.tests.Mat]);
  testMatches.push(['Runs', data.data.batting.tests.Runs]);
  testMatches.push(['50s', data.data.batting.tests[50]]);
  testMatches.push(['100s', data.data.batting.tests[100]]);
  testMatches.push(['Ave', data.data.batting.tests.Ave]);
  testMatches.push(['SR', data.data.batting.tests.SR]);
  return testMatches.toString();
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

main();
