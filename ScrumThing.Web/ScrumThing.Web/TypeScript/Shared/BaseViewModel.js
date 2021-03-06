/// <reference path="../providers/iteamprovider.ts" />
/// <reference path="../providers/teamprovider.ts" />
var ScrumThing;
(function (ScrumThing) {
    var BaseViewModel = (function () {
        function BaseViewModel(teamProvider) {
            var _this = this;
            this.currentTeam = ko.observable();
            this.teams = ko.observableArray();
            this.RefreshData = function () { throw new Error("This method must be overriden."); };
            this.showSprintDropdown = ko.observable(true);
            this.TeamProvider = teamProvider;
            this.GetTeams();
            this.currentTeamDropdown = ko.computed(function () {
                return _this.currentTeam() ? _this.currentTeam().TeamName : '';
            });
            this.currentTeam.subscribe(function () {
                jQuery.cookie('team', _this.currentTeam().TeamName, { expires: 365 });
            });
        }
        BaseViewModel.prototype.GetTeams = function () {
            var _this = this;
            this.TeamProvider.GetTeams().done(function (teams) {
                _this.teams(teams);
                var presetTeam = _this.getUrlVars()["Team"] || jQuery.cookie('team');
                var newTeam = _this.teams()[0];
                for (var ii = 0; ii < _this.teams().length; ii++) {
                    var team = _this.teams()[ii];
                    if (team.TeamName == presetTeam) {
                        newTeam = team;
                    }
                }
                _this.currentTeam(newTeam);
            });
        };
        BaseViewModel.prototype.getUrlVars = function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        };
        return BaseViewModel;
    })();
    ScrumThing.BaseViewModel = BaseViewModel;
})(ScrumThing || (ScrumThing = {}));
//# sourceMappingURL=BaseViewModel.js.map