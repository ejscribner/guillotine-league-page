/*   STEP 1   */
export const leagueID = "1137298745177042944"; // your league ID
export const leagueName = "West Coast Guillotine"; // your league name
export const dues = 25; // (optional) used in template constitution page
export const dynasty = false; // true for dynasty leagues, false for redraft and keeper
export const enableBlog = false; // requires VITE_CONTENTFUL_ACCESS_TOKEN and VITE_CONTENTFUL_SPACE environment variables

/*   STEP 2   */
export const homepageText = `
  <p>Welcome to the Guillotine Fantasy Football League. In this league, teams are eliminated based on their combined score over two-week periods. At the end of each period, the team with the lowest score is removed from the league. The competition continues until only one team remains as the champion.</p>
`;

/*   STEP 3   */
/*
3 managers as an example. Uncomment (remove the //) before each line to make it live code
If you're having trouble, reference the Training Wheels' Manager Section
https://github.com/nmelhado/league-page/blob/master/TRAINING_WHEELS.md#ii-adding-managers-and-changing-the-homepage-text
*/

// To omit an optional field, set it's value to null

export const managers = [
  {
    managerID: "740287510378385408", // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    name: "Gabones",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo: "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2014, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    // "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Rival", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Your fantasy team's philosophy", // (optional)
    tradingScale: 10, // 1 - 10 (optional)
    preferredContact: "Text", // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
  {
    managerID: "740302867038117888", // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    name: "apark216",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo: "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2014, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    // "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Rival", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Your fantasy team's philosophy", // (optional)
    tradingScale: 10, // 1 - 10 (optional)
    preferredContact: "Text", // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
  {
    managerID: "874138926951161856", // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    name: "ejscribner",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo: "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2014, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    // "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Rival", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Your fantasy team's philosophy", // (optional)
    tradingScale: 10, // 1 - 10 (optional)
    preferredContact: "Text", // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
  {
    managerID: "1122055149310091264", // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    name: "jacobthayer",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo: "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2014, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    // "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Rival", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Your fantasy team's philosophy", // (optional)
    tradingScale: 10, // 1 - 10 (optional)
    preferredContact: "Text", // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
  {
    managerID: "1137298295015182336", // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    name: "joshmq",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo: "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2014, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    // "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Rival", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Your fantasy team's philosophy", // (optional)
    tradingScale: 10, // 1 - 10 (optional)
    preferredContact: "Text", // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
  {
    managerID: "1137814767768518656", // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    name: "NickAtNight115",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo: "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2014, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    // "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Rival", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Your fantasy team's philosophy", // (optional)
    tradingScale: 10, // 1 - 10 (optional)
    preferredContact: "Text", // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
  {
    managerID: "1137814838010494976", // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    name: "chatseattle",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo: "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2014, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    // "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Rival", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Your fantasy team's philosophy", // (optional)
    tradingScale: 10, // 1 - 10 (optional)
    preferredContact: "Text", // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
  {
    managerID: "1138908290718507008", // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    name: "harbaughlover10",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo: "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2014, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    // "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Rival", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Your fantasy team's philosophy", // (optional)
    tradingScale: 10, // 1 - 10 (optional)
    preferredContact: "Text", // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
  {
    managerID: "1139070389801762816", // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    name: "alexpelletier69",
    location: "Brooklyn", // (optional)
    bio: "Lorem ipsum...",
    photo: "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    fantasyStart: 2014, // (optional) when did the manager start playing fantasy football
    favoriteTeam: "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    // "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    rival: {
      name: "Rival", // Can be anything (usually your rival's name)
      link: 6, // manager array number within this array, or null to link back to all managers page
      image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    },
    favoritePlayer: 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    valuePosition: "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    rookieOrVets: "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    philosophy: "Your fantasy team's philosophy", // (optional)
    tradingScale: 10, // 1 - 10 (optional)
    preferredContact: "Text", // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
  },
];

/*   !!  !!  IMPORTANT  !!  !! */
/*
  Below is the most up to-date version of a manager. Please leave this commented out
  and don't delete it. This will be updated if any fields are added, removed or changed
  and will allow updates without causing merge conflicts
  */

// {
//   "roster": 3,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
//   "managerID": "12345678",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
//   "name": "Your Name",
//   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
//   "location": "Brooklyn", // (optional)
//   "bio": "Lorem ipsum...",
//   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
//   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
//   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
//   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
//   "rival": {
//     name: "Rival", // Can be anything (usually your rival's name)
//     link: 6, // manager array number within this array, or null to link back to all managers page
//     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
//   },
//   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
//   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
//   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
//   "philosophy": "Your fantasy team's philosophy", // (optional)
//   "tradingScale": 10, // 1 - 10 (optional)
//   "preferredContact": "Text",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
// },
