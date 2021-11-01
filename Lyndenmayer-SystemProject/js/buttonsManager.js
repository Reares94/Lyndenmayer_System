let axiom = "";
let rule1 = "";
let rule2 = "";
var angle = 0;
var branchLength = 5;
var branchRadius = 0.4;
var initialBranchRadius = 0.4;
var lengthReductionFactor = 0.05;
var radiusReductionFactor = 0.05;
var leafsPositions = [[]];
var barkTexture = 1;

//Button management
$(function() 
{
    $('#planting').on('click', function (e) 
    {
        //Get input text value
        e.preventDefault();
        axiom = document.getElementById("axiom").value;
        rule1 = document.getElementById("rule1").value;
        rule2 = document.getElementById("rule2").value;
        let iterations = document.getElementById("iterations").value;

        angle = document.getElementById("degrees").value;
        branchLength = document.getElementById("length").value;
        branchRadius = document.getElementById("radius").value;
        initialBranchRadius = document.getElementById("radius").value;
        lengthReductionFactor = (document.getElementById("lengthReductionFactor").value) / 100;
        radiusReductionFactor = (document.getElementById("radiusReductionFactor").value) / 100;

        let season = document.getElementById('season').value;
        barkTexture = document.getElementById('bark').value;
        colorChanger(season);

        // Final geometry tree
        var totalGeometry = new THREE.Geometry();
                
        // Preset prototype position coordinates
        let topPoint = new THREE.Vector3(0, -45, 0);

        //Triangle mesh management
        let triangleName = scene.getObjectByName('triangleName');
        if (triangleName != null) 
        {
            topPoint = triangleName.position;
            scene.remove(scene.getObjectByName('triangleName'));
            triangleMesh = null;
        }
      
        //Rule axiom
        let j = 0;
        let rightX = 0;
        let rightY = 0;
        let rightZ = 0;

        let preXAngle = 0;
        let preYAngle = 0;
        let preZAngle = 0;

      
        for (let i = 0; i < axiom.length; i++)
        {

            if (axiom.charAt(i) === "+") {
                rightX += 1;
                continue;
            }

            if (axiom.charAt(i) === "-") {
                rightX -= 1;
                continue;
            }

            if (axiom.charAt(i) === "^") {
                rightY += 1;
                continue;
            }

            if (axiom.charAt(i) === "v") {
                rightY -= 1;
                continue;
            }

            if (axiom.charAt(i) === ">") {
                rightZ += 1;
                continue;
            }

            if (axiom.charAt(i) === "<") {
                rightZ -= 1;
                continue;
            }

            if (axiom.charAt(i) === "f") {
                topPoint = addBranch(totalGeometry, branchLength * (1 - j * lengthReductionFactor),
                    branchRadius * (1 - j * radiusReductionFactor), topPoint, angle * rightX + preXAngle,
                    angle * rightY + preYAngle, angle * rightZ + preZAngle);
                j += 1;

                preXAngle += angle * rightX;
                preYAngle += angle * rightY;
                preZAngle += angle * rightZ;
                rightX = 0;
                rightY = 0;
                rightZ = 0;
            }

            if (axiom.charAt(i) === "A") {
                guess=1;
                ruleGeneration(totalGeometry, topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j,guess);
                continue;
            }

            if (axiom.charAt(i) === "B") {
                guess=2
                ruleGeneration(totalGeometry, topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j);
            }

        }
        //Bark texture management
        let texture = new THREE.TextureLoader().load('images/pinebark1.jpg');

        switch (barkTexture) {
            case "1":
                texture = new THREE.TextureLoader().load('images/pinebark1.jpg');
                break;

            case "2":
                texture = new THREE.TextureLoader().load('images/maplebark.jpg');
                break;

            case "3":
                texture = new THREE.TextureLoader().load('images/pinebark2.jpg');
                break;
        }

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const timesToRepeatHorizontally = 1;
        const timesToRepeatVertically = 4;
        texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);
        texture.rotation = toRadians(15);

        var material = new THREE.MeshPhongMaterial({
            map: texture,
        });

        var mesh = new THREE.Mesh(totalGeometry, material);

        //Creator function
        LemonOrLeaf_Creator(season)

        mesh.receiveShadow = true;
        mesh.castShadow = true;

        leafsPositions = [[]];

        scene.add(mesh);

    });


    //Preset
    const presets = document.getElementById('presets');
    presets.addEventListener('change', (event) => 
    {
        let axiomP = document.getElementById("axiom");
        let rule1P = document.getElementById("rule1");
        let rule2P = document.getElementById("rule2");
        let iterationsP = document.getElementById("iterations");

        let angleP = document.getElementById("degrees");
        let branchLengthP = document.getElementById("length");
        let branchRadiusP = document.getElementById("radius");
       
        let lengthReductionFactorP = document.getElementById("lengthReductionFactor");
        let radiusReductionFactorP = document.getElementById("radiusReductionFactor");

        let seasonP = document.getElementById('season');
        let barkTextureP = document.getElementById('bark');

        switch (event.target.value) 
        {
            //TREE
            case "PIANTA1":
                axiomP.value = "fffffBA<f<fAB";
                rule1P.value = "-f-fB<f<f+f+f>f>fB<B";
                rule2P.value = "+f+fA>f>f+f+fAB";
                iterationsP.value = "5";

                angleP.value = "17";
                branchLengthP.value = "7";
                lengthReductionFactorP.value = "4.5";
                branchRadiusP.value = "1.3";
                radiusReductionFactorP.value = "5.5";

                seasonP.value = "3";
                barkTextureP.value = "1";

                break;

            //JAPANESE RED MAPLE
            case "PIANTA2":
                axiomP.value = "f>fABf-f-fA<f<f";
                rule1P.value = "+f<fB+-f-f^ff+f+f";
                rule2P.value = "A-f--f++f>f>+f+f";
                iterationsP.value = "7";

                angleP.value = "30";
                branchLengthP.value = "5";
                lengthReductionFactorP.value = "2";
                branchRadiusP.value = "0.7";
                radiusReductionFactorP.value = "10";

                seasonP.value = "4";
                barkTextureP.value = "2";

                break;

            //DRY TREE
            case "PIANTA3":
                axiomP.value = "fffff---A++B<<A>>++BA";
                rule1P.value = "^fv+ff>f>f--B^^fa";
                rule2P.value = "fffA+<A<+A";
                iterationsP.value = "7";

                angleP.value = "30";
                branchLengthP.value = "10";
                lengthReductionFactorP.value = "5";
                branchRadiusP.value = "1.15";
                radiusReductionFactorP.value = "8.5";

                seasonP.value = "1";
                barkTextureP.value = "3";

                break;

            //LEMON TREE
            case "PIANTA4":
                axiomP.value = "f--f++A++B----A";
                rule1P.value = "^^fv+<f->Bf<^f<B";
                rule2P.value = "f-->Af++fA<A";
                iterationsP.value = "5";

                angleP.value = "15";
                branchLengthP.value = "5";
                lengthReductionFactorP.value = "3";
                branchRadiusP.value = "0.8";
                radiusReductionFactorP.value = "7";

                seasonP.value = "2";
                barkTextureP.value = "2";

                break;

            //BUSH
            case "PIANTA5":
                axiomP.value = "ffA>--A<--<A";
                rule1P.value = "f+-Bv>B<+<+<B";
                rule2P.value = "f++f-fA<+<fA";
                iterationsP.value = "4";

                angleP.value = "135";
                branchLengthP.value = "2";
                lengthReductionFactorP.value = "0.5";
                branchRadiusP.value = "0.5";
                radiusReductionFactorP.value = "8.5";

                seasonP.value = "3";
                barkTextureP.value = "2";

                break;

 

        }
    });

});


