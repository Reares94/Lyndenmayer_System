
//Angles management
function toRadians (angle) {
    return (angle * Math.PI) / 180;
}

function toDegrees (angle) {
    return angle * (180 / Math.PI);
}

//Color Leaf 
function colorChanger(actualSeason) 
{
    switch (actualSeason) 
    {
        //Dry
        case "1":
            break;

        //Green leaves and lemons
        case "2":
            leafColor = 0x009f19;
            break;

        //Green Leaves 
        case "3":
            leafColor = 0x16691c;
            break;

        //Red leaves
        case "4":
            leafColor = 0x990000;
            break;
    }

}

//Add branch to the scene
function addBranch(totalGeometry, branchLength, branchRadius, topTargetPt, theta, rho, phi) 
{

    if (branchLength < 0 || branchRadius < 0)
        return topTargetPt;

    var newTopPoint = new THREE.Vector3(0, branchLength / 2, 0);
    var bottomPoint = new THREE.Vector3(0, - branchLength / 2, 0);

    //Modeling branches as cylinders
    var branch = new THREE.CylinderGeometry(branchRadius * (1 - radiusReductionFactor), branchRadius, branchLength, 32);
    var branchMesh = new THREE.Mesh(branch);

    branchMesh.autoUpdate = false;

    //Rotation for angles
    branchMesh.rotateX(toRadians(theta));
    branchMesh.rotateY(toRadians(rho));
    branchMesh.rotateZ(toRadians(phi));
    branchMesh.updateMatrix();

    //Calculate the new points
    newTopPoint.applyEuler(branchMesh.rotation);
    bottomPoint.applyEuler(branchMesh.rotation);

    //Translation by alignment from the bottom to the top target on entry
    newTopPoint.x = newTopPoint.x + topTargetPt.x - bottomPoint.x;
    newTopPoint.y = newTopPoint.y + topTargetPt.y - bottomPoint.y;
    newTopPoint.z = newTopPoint.z + topTargetPt.z - bottomPoint.z;

    branchMesh.position.set(topTargetPt.x - bottomPoint.x, topTargetPt.y - bottomPoint.y, topTargetPt.z - bottomPoint.z);
    branchMesh.updateMatrix();

    //Threshold 
    let threshold_leaves=(branchRadius / initialBranchRadius)
   
    if ((threshold_leaves < 0.6) &&(threshold_leaves > 0.01) ) {
   
        let position = [newTopPoint.x, newTopPoint.y, newTopPoint.z, theta + angle, rho + angle, phi + angle];
        leafsPositions.push(position);
        position = [newTopPoint.x, newTopPoint.y, newTopPoint.z, theta - angle, rho - angle, phi - angle];
        leafsPositions.push(position);
    }

    branchMesh.castShadow = true;
    branchMesh.receiveShadow = true;

    totalGeometry.merge(branchMesh.geometry, branchMesh.matrix);

    totalGeometry.castShadow = true;
    totalGeometry.receiveShadow = true;

    return newTopPoint;

}

//Rule generation
function ruleGeneration(totalGeometry, topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j,guess) 
{
    if (iterations === 0)
        return;

    if( guess==1)
    {
        rule=rule1;
    }else if(guess=2)
    { 
        rule=rule2;
    }

    for (let i = 0; i < rule.length; i++) 
    {

        if (rule.charAt(i) === "+") {
            rightX += 1;
            continue;
        }

        if (rule.charAt(i) === "-") {
            rightX -= 1;
            continue;
        }

        if (rule.charAt(i) === "^") {
            rightY += 1;
            continue;
        }

        if (rule.charAt(i) === "v") {
            rightY -= 1;
            continue;
        }

        if (rule.charAt(i) === ">") {
            rightZ += 1;
            continue;
        }

        if (rule.charAt(i) === "<") {
            rightZ -= 1;
            continue;
        }
        if (rule.charAt(i) === "f") {
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

        if (rule.charAt(i) === "A") {
            guess=1
            ruleGeneration(totalGeometry, topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                rightZ, j,guess);
            continue;
        }

        if (rule.charAt(i) === "B") {
            guess=2
            ruleGeneration(totalGeometry, topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                rightZ, j,guess);
            continue;
        }    
    }
}


//Leaves creation
function LemonOrLeaf_Creator(season) 
{

    let leafShape = new THREE.Shape();
    let Total = new THREE.Mesh();

        //Bezier leaf 
        if (season!== "1" && season!=="2") 
            {
                leafShape.bezierCurveTo(0,0,4,0,0,0)
                leafShape.bezierCurveTo(-3,0,-3,7,-3,7)
                leafShape.bezierCurveTo(-3,11,-3,15.4,5,25)
                leafShape.bezierCurveTo(12,15.4,10,11,10,7)
                leafShape.bezierCurveTo(10,7,10,0,4,0)
                leafShape.bezierCurveTo(7,0,5,5,0,0)
        
                //Red maple leaf
                if (season=="4")
                { 
                        const leafPt = [];
       
                        //First bottom right
                        leafPt.push( new THREE.Vector2( 0, 50) );
                        leafPt.push( new THREE.Vector2( 50,0) );
                        leafPt.push( new THREE.Vector2( 100,-20) ); 
                        leafPt.push( new THREE.Vector2( 200,10) );
                        leafPt.push( new THREE.Vector2( 300,100) );
                        leafPt.push( new THREE.Vector2( 200, 70) );
                        leafPt.push( new THREE.Vector2( 100,85) );
                        leafPt.push( new THREE.Vector2( 50,100) );


                        //Second in the middle on the right
                        
                        leafPt.push( new THREE.Vector2( 175,180) );
                        leafPt.push( new THREE.Vector2( 280,260) );
                        leafPt.push( new THREE.Vector2( 350,350))
                        leafPt.push( new THREE.Vector2( 230,320) );
                        leafPt.push( new THREE.Vector2( 175,280) );
                        leafPt.push( new THREE.Vector2( 50,200) )

                        //Third branch on the right
                        leafPt.push( new THREE.Vector2( 150,290) );
                        leafPt.push( new THREE.Vector2( 240,380) );
                        leafPt.push( new THREE.Vector2( 300,500) );
                        leafPt.push( new THREE.Vector2( 240,500) );
                        leafPt.push( new THREE.Vector2( 150,430) );
                        leafPt.push( new THREE.Vector2( 50,300) );


                        //Tip
                        leafPt.push( new THREE.Vector2( 25,520) );
                        leafPt.push( new THREE.Vector2( 0,560) );
                        leafPt.push( new THREE.Vector2( -25,520) );


                        //Third inverse
                        leafPt.push( new THREE.Vector2( -50,300) );
                        leafPt.push( new THREE.Vector2( -150,430) );
                        leafPt.push( new THREE.Vector2( -240,500) );
                        leafPt.push( new THREE.Vector2( -300,500) );
                        leafPt.push( new THREE.Vector2( -240,380) );
                        leafPt.push( new THREE.Vector2( -150,290) );


                        //Second inverse
                        leafPt.push( new THREE.Vector2( -50,200) )
                        leafPt.push( new THREE.Vector2( -175,280) );
                        leafPt.push( new THREE.Vector2(-230,320) );
                        leafPt.push( new THREE.Vector2( -350,350))
                        leafPt.push( new THREE.Vector2( -280,260) );
                        leafPt.push( new THREE.Vector2( -175,180) );

                        

                        //First reverse
                        leafPt.push( new THREE.Vector2( -50,100) );
                        leafPt.push( new THREE.Vector2( -100,85) );
                        leafPt.push( new THREE.Vector2( -200,70) );
                        leafPt.push( new THREE.Vector2( -300,100) );
                        leafPt.push( new THREE.Vector2( -200,10) );
                        leafPt.push( new THREE.Vector2( -100,-20) );


                        for ( let i = 0; i < leafPt.length; i ++ ) leafPt[ i ].multiplyScalar( 0.10 );
                        leafShape = new THREE.Shape( leafPt );
                     
                }

 
                let geometry = new THREE.ShapeGeometry(leafShape);
                let material = new THREE.MeshPhongMaterial({color:leafColor});
                

                let leaf = new THREE.Geometry();
                leaf.merge(geometry);

                leaf.matrixAutoUpdate  = false;

        
                leaf.rotateY(toRadians(-90));
                leaf.rotateX(toRadians(-3.5));
                if(season=="4")
                {
                    leaf.translate(0.25, -8.5, 0);
                }else{
                    leaf.translate(0.25, -8.5, -3.5);
                }
            
                //Create the cylindrical stem
                let stemGeometry = new THREE.CylinderGeometry(0.2, 0.6, 32, 20);
                let stemMesh = new THREE.Mesh(stemGeometry);

                let leafTotalGeometry = new THREE.Geometry();
                leafTotalGeometry.merge(stemMesh.geometry, stemMesh.matrix);
                leafTotalGeometry.merge(leaf);

                Total = new THREE.Mesh(leafTotalGeometry, material);
            
            }    
            //Creation Leaf&Lemon
            else if(season =="2" )
            {
                let x = 0, y = 0;

                let leaves = new THREE.Geometry();
                let partialLeaves= new THREE.Geometry();
            
                //Different leaf bezier
                leafShape.bezierCurveTo(0,0,4,0,0,0)
                leafShape.bezierCurveTo(-3,0,-3,7,-3,7)
                leafShape.bezierCurveTo(-3,11,-3,15.4,5,25)
                leafShape.bezierCurveTo(12,15.4,10,11,10,7)
                leafShape.bezierCurveTo(10,7,10,0,4,0)
              
                
                
                let geometry = new THREE.ShapeGeometry( leafShape );
                
                geometry.rotateY(toRadians(90));
                geometry.rotateX(toRadians(10));
                geometry.rotateZ(toRadians(90));
                geometry.translate(10, 4.1, 0);
             
                partialLeaves.merge(geometry);
            
            
                leaves.merge(partialLeaves);
            
                let material = new THREE.MeshPhongMaterial( {color:leafColor} );
                Total = new THREE.Mesh(leaves, material) ;
            
                //Lemon shape
                const texture=new THREE.TextureLoader().load("images/lemonpeel.jpg")
                const lemonGeometry = new THREE.SphereGeometry(6, 64,13,6,6.3);
                let materialLemon = new THREE.MeshPhongMaterial( {map:texture} );
                let circle = new THREE.Mesh(lemonGeometry, materialLemon);


                circle.rotateY(toRadians(-90));
                circle.position.set(5, -2, 0);
                circle.material.side = THREE.DoubleSide;
 
                Total.add(circle);
                Total.rotateZ(toRadians(-90));
                Total.position.set(0.5, 0.3, 0);
             }

            Total.material.side = THREE.DoubleSide;
            Total.castShadow = true

            //Different scaling according to the chosen leaf
            if(season==2)
            {
                Total.scale.x=0.05
                Total.scale.y=0.06
                Total.scale.z=0.06
            }
            else if(season==4)
            {
                Total.scale.x = 0.07;
                Total.scale.y = 0.07;
                Total.scale.z = 0.07;
            }else
            {
                Total.scale.x = 0.08;
                Total.scale.y = 0.08;
                Total.scale.z = 0.08;
            }

        
            let bottomPoint = new THREE.Vector3(Total.position.x, Total.position.y - 0.77, Total.position.z);
            if(season=="4")
            {
                bottomPoint = new THREE.Vector3(Total.position.x, Total.position.y -0.25, Total.position.z);
            }
            //Position and rotation of the leaves on the tree
            for (let i = 0; i < leafsPositions.length; i++) 
            {
                let newLeaf = Total.clone();
                newLeaf.autoUpdate = false;
                let newBottomPoint = bottomPoint.clone();

                newLeaf.rotateX(toRadians(leafsPositions[i][3]));
                newLeaf.rotateY(toRadians(leafsPositions[i][4]));
                newLeaf.rotateZ(toRadians(leafsPositions[i][5]));

                newLeaf.updateMatrix();
                newBottomPoint.applyEuler(newLeaf.rotation);

                newLeaf.position.set(leafsPositions[i][0] - newBottomPoint.x, leafsPositions[i][1] - newBottomPoint.y,
                 leafsPositions[i][2] - newBottomPoint.z);

                scene.add(newLeaf);
            }
           
}






