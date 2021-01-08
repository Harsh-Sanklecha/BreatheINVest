checkHeadphone = function () {
        window.plugins.headsetdetection.detect(function (detected) {
            alert("Headphone " + detected)
        })
    }
