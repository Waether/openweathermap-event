module.exports = {
    CheckOnTempChange: function(data, dataOld) {
        return new Promise((resolve, reject) => {
            if (data.main.temp !== dataOld.main.temp)
                resolve(data.main.temp);
            reject("No Changes");
        });
    },

    OnTempChange: function(newTemp) {
        console.log("Temperature changed to " + newTemp);
    }
};

