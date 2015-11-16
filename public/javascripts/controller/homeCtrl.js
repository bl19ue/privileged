/**
 * Created by Neeraj on 11/15/2015.
 */
angular.module('myApp')
    .controller('homeCtrl', function() {
        var self = this;
        self.readonly = false;
        self.interests = [];

        self.roInterests = angular.copy(self.interests);
        self.tags = [];

        self.newInterest = function(chip) {
            return {
                name: chip,
                type: 'unknown'
            };
        };
    });
