/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */ 

/*Things to work on:
1. Get sphere subshapes to display and improve upon the literal zombie object code.
2. Create animation for the zombies.
3. Create a sort of AI, that would react if camera get within X distance away from any zombie.
4. Each zombie should have their own location values and be able to move separately.
5.Implement textures for objects.
*/

(function (canvas) {

    // Because many of these variables are best initialized then immediately
    // used in context, we merely name them here.  Read on to see how they
    // are used.
    var gl, // The WebGL context.

        // The shader program to use.
        shaderProgram,

        // Utility variable indicating whether some fatal has occurred.
        abort = false,

        // Important state variables.
        normalArray = [],

        //Camera Variables
        cameraZ = 20.0, 
        cameraY = 3.0,
        cameraX = 0.0,
        camPosition = new Vector(cameraX, cameraY, cameraZ),  
        cxPointer = 0.0,
        cyPointer = 3.0,
        czPointer = 0.0, 
        camPointer = new Vector(cxPointer, cyPointer, czPointer),
        alpha = 0.0,
        alphaRads = 0.0,
        viewRadius = 20.0,
        pitAngle = 0.0,
        udEvent = false,
        lrEvent = false,

        //Zombie Variables
        zombieLocation = new Vector(0.0, 0.0, 5.0),  
        zX = 0.0,
        zZ = 0.0,

        transX = 0.0,
        transY = 0.0,
        transZ = 10.0,
        scaleX = 30.0,
        scaleY = 0.0,
        scaleZ = 20.0,
        colR = 0.0,
        colG = 0.0,
        colB = 0.0,

        //Transform Variables
        rotationMatrix,
        cameraMatrix,
        projectionMatrix,
        translationMatrix,
        scaleMatrix,

      /*  cubeImage,
        cubeTexture,
        textureCoordAttribute,
        cubeVerticesTextureCoordBuffer,*/

        //Vertex Variable
        vertexPosition,

        //Specular and Diffuse Light variables
        vertexDiffuseColor,
        vertexSpecularColor,
        shininess,
        normalVector,
        lightPosition,
        lightDiffuse,
        lightSpecular,
        lightSpecular,

        // Reusable loop variables.
        i,
        maxi,
        j,
        maxj,
        k,
        maxk,


    // Grab the WebGL rendering context.
    gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);
//Create the zombie...
//Try to clean up the zombie object code, so that not so many subshapes.
    createZombie = function(zombieX, zombieZ) {
        var zombie = {
        //Zombie Body
            color: { r: 1.0, g: 0.0, b: 0.0 },
            specularColor: { r: 1.0, g: 0.0, b: 0.0 },
            shininess: 25,  
            vertices: Shapes.toRawTriangleArray(Shapes.sphere()),
            normals: Shapes.toVertexNormalArray(Shapes.sphere()),
            mode: gl.TRIANGLES,
			undead: true,
            transforms: {
                trans: { x: zombieX, y: 5.0, z: zombieZ },         
                scale: { x: 1.0, y: 1.0, z: 1.0 }
            },
            subshapes: [
            //Zombie Head
                {
                    color: { r: 1.0, g: 1.0, b: 0.0 }, 
                    specularColor: { r: 1.0, g: 1.0, b: 0.0 },
                    shininess: 25,            
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
                    normals: Shapes.toVertexNormalArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX, y: 0.0, z: zombieZ },        
                        scale: { x: 1.0, y: 10.0, z: 1.0 }
                    }
				},
				{
                    color: { r: 1.0, g: 0.0, b: 1.0 }, 
                    specularColor: { r: 1.0, g: 0.0, b: 1.0 },
                    shininess: 25,            
                    vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
                    normals: Shapes.toVertexNormalArray(Shapes.tetrahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX, y: 2.5, z: zombie-0.1 },        
                        scale: { x: 1.0, y: 1.0, z: 1.0 }
                    }
			    }/*,
            //Zombie Legs
                {
                    color: { r: 0.0, g: 0.0, b: 0.0 },           
                    vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
					normals: Shapes.toVertexNormalArray(Shapes.tetrahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX-0.5, y: 0.3, z: zombieZ },        
                        scale: { x: 2.0, y: 2.0, z: 2.0 }
                    } 
                },
                {
                    color: { r: 0.0, g: 0.0, b: 0.0 },           
                    vertices: Shapes.toRawTriangleArray(Shapes.tetrahedron()),
					normals: Shapes.toVertexNormalArray(Shapes.tetrahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX+0.5, y: 0.3, z: zombieZ },        
                        scale: { x: 2.0, y: 2.0, z: 2.0 }
                    },
                    subshapes: [
                      {
                        color: { r: 0.0, g: 0.0, b: 0.0 },           
                        vertices: Shapes.toRawTriangleArray(Shapes.sphere()),
						normals: Shapes.toVertexNormalArray(Shapes.sphere()),
                        mode: gl.TRIANGLES,
                        transforms: {
                            trans: { x: zombieX+0.5, y: 0.3, z: zombieZ },        
                            scale: { x: 23.0, y: 2.0, z: 2.0 }
                        } 
                      }
                    ]
                },           
            //Zombie Arms
                {
                    color: { r: 0.1, g: 0.0, b: 0.0 },           
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
					normals: Shapes.toVertexNormalArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX-0.5, y: 6.0, z: zombieZ+13.0 },        
                        scale: { x: 5.0, y: 0.5, z: 0.5 }
                    } 
                },
                {
                    color: { r: 0.1, g: 0.0, b: 0.0 },           
                    vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
					normals: Shapes.toVertexNormalArray(Shapes.hexahedron()),
                    mode: gl.TRIANGLES,
                    transforms: {
                        trans: { x: zombieX+0.5, y: 6.0, z: zombieZ+13.0 },        
                        scale: { x: 5.0, y: 0.5, z: 0.5 }
                    } 
                }
            ],
			//Function that should move zombie object a certain x and y distance.
            move: function(xVal,zVal) {
				this.zX += xVal;
				this.zZ += zVal;
				
			}*/	
            ]			
        }
        return zombie;
    };
//transX, transY, transZ, scaleX, scaleY, scaleZ
    createWallSegment = function(transX, transY, transZ, scaleX, scaleY, scaleZ, colR, colG, colB) {
    //Default wall segment properties.
        var wallSegment = {

            color: { r: colR, g: colG, b: colB },
            specularColor: { r: 1.0, g: 0.0, b: 0.0 },
            shininess: 25,  
            vertices: Shapes.toRawTriangleArray(Shapes.hexahedron()),
            normals: Shapes.toVertexNormalArray(Shapes.hexahedron()),
            mode: gl.TRIANGLES,
			undead: false,
            transforms: {
                trans: { x: transX, y: transY, z: transZ },         
                scale: { x: scaleX, y: scaleY, z: scaleZ }
            }

        }
        return wallSegment;
    };

/* Pass the current translation transform values from parent to child.
 * No need to pass scale or rotate, because that would screw up the original 
 * look of the objects.
 */
    // JD: ^^^Maybe no need for your particular scene, but it *is* possible
    //     to also pass on scale and rotate transformations.  At least this
    //     shows you understand the concept; what's missing is sufficient
    //     *implementation* understanding to see the mechanism that will
    //     allow you to pass *all* of the transforms from parent to child.
    //
    //     Unfortunately, you don't *use* this function, probably because
    //     you hit the limitation posed by trying to pass transforms by
    //     modifying the child's transforms.  If you realized that you can
    //     pass the *matrices* for these transforms, things would have
    //     worked out better.
    var passTransforms = function (parent, child) {
        if (parent.transforms.trans) {
            child.transforms.trans.x += parent.transforms.trans.x;
            child.transforms.trans.y += parent.transforms.trans.y;
            child.transforms.trans.z += parent.transforms.trans.z;
        }
        return child;
    };

    // Build the objects to display.
    var objectsToDraw = [
    // (transX, transY, transZ / scaleX, scaleY, scaleZ / colR, colG, colB)
        createWallSegment(100.0, 0.0, -0.3, 1.0, 25.0, 800.0, 0.0, 0.0, 1.0),  //Right Wall
        createWallSegment(-100.0, 0.0, -0.3, 1.0, 25.0, 800.0, 0.0, 0.0, 1.0),   //Left Wall
        createWallSegment(0.0, 0.0, 150.0, 400.0, 25.0, 1.0, 0.0, 0.0, 1.0),    //Back Wall

        createWallSegment(0.1, 0.0, -180.0, 450.0, 25.0, 1.0, 0.0, 0.0, 1.0),    //Front Wall
        createWallSegment(0.3, 0.0, -100.0, 200.0, 25.0, 1.0, 0.0, 0.5, 1.0),    //Front Wall Right half
        createWallSegment(-0.3, 0.0, -100.0, 200.0, 25.0, 1.0, 0.0, 0.5, 1.0),    //Front Wall Left half
        createWallSegment(0.0, 0.0, -230.0, 400.0, 25.0, 1.0, 0.0, 0.0, 1.0),    //Front Wall 3

        createWallSegment(0.0, 0.0, -0.3, 400.0, 0.0, 800.0, 0.6, 0.5, 0.5),   //Building Floor
        createWallSegment(0.0, 25.0, -0.8, 400.0, 0.5, 333.0, 0.0, 1.0, 0.0),   //Building Ceiling

        createZombie(-10.0, -30.0),          
		createZombie(10.0, -30.0)
    ];
                // JD: Nice catch for avoiding normal vector errors, but at a cost---
                //     most of your scene is not lit at all!  And to think that the
                //     fix for this would be a single additional line per object.
                //     (or less if you wrote a function like createWallSegment)
    // Pass the vertices, colors, and now specular colors to WebGL.
		var passVertices = function(objects) {
                objects.buffer = GLSLUtilities.initVertexBuffer(gl,
                    objects.vertices);
            //Create the default normal array in case of no lighting variables for current object.
                for (k = 0; maxk = objects.vertices.length, k < maxk; k += 1) {
                    normalArray.push(0.5);
                }
            //If we have a single color, we expand that into an array of the same color over and over.
                if (!objects.colors) {
                    objects.colors = [];
                    for (j = 0, maxj = objects.vertices.length / 3; j < maxj; j += 1) {
                        objects.colors = objects.colors.concat(
                            objects.color.r,
                            objects.color.g,
                            objects.color.b
                        );
                    }
                }  
                objects.colorBuffer = GLSLUtilities.initVertexBuffer(gl,
                    objects.colors);              
            //Same trick as above.
                if (!objects.specularColors) {
                    objects.specularColors = [];      
                    for (j = 0, maxj = objects.vertices.length / 3; j < maxj; j += 1) {
                        objects.specularColors = objects.specularColors.concat(
                            (objects.specularColor ? objects.specularColor.r : 1.0),
                            (objects.specularColor ? objects.specularColor.g : 1.0),
                            (objects.specularColor ? objects.specularColor.b : 1.0)
                        );
                    }
                    objects.specularBuffer = GLSLUtilities.initVertexBuffer(gl,
                        objects.specularColors);
                    objects.normalBuffer = GLSLUtilities.initVertexBuffer(gl,
                        (objects.normals ? objects.normals : normalArray)); 
                }
		};
		
	    //Recursively pass the vertices of the subshapes.	
        for (i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {            
			    passVertices(objectsToDraw[i]);			
                if (objectsToDraw[i].subshapes) {
					for (var j = 0; j < objectsToDraw[i].subshapes.length; j++) {
                      passVertices(objectsToDraw[i].subshapes[j]);
                    }
				}       
        };

    // Initialize the shaders.
    shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);
  
 /* 
  * The following links the GLSL Variables with new javascript variables. 
  */   
    vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    rotationMatrix = gl.getUniformLocation(shaderProgram, "rotationMatrix");
    projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix"); 
    translationMatrix = gl.getUniformLocation(shaderProgram, "translationMatrix");
    scaleMatrix = gl.getUniformLocation(shaderProgram, "scaleMatrix");  
    cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");


    lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    shininess = gl.getUniformLocation(shaderProgram, "shininess");

    /*
     * Displays an individual object. Creates the 4x4 matrices for translation, scale, and rotation.
	 * The "object" that the drawObject function takes as an argument, has its trans and scale properties brought to webgl here.
     */
    var drawObject = function (object) { 
    // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0); 
        gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
        gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);  
        // Set the shininess.
        gl.uniform1f(shininess, object.shininess);
/*
 * Creates a new matrix with the newly created and linked javascript variables (i.e. translationMatrix)
 * and sends matrices to the shaders.
 */
        //Set up instance transforms.
        gl.uniformMatrix4fv(translationMatrix,
            gl.FALSE, new Float32Array(object.transforms.trans ?
                Matrix4x4.getTranslationMatrix( 
                    object.transforms.trans.x, 
                    object.transforms.trans.y, 
                    object.transforms.trans.z ).toWebGLArray() : 
                new Matrix4x4().toWebGLArray()
            )
        ),

        gl.uniformMatrix4fv(scaleMatrix,
            gl.FALSE, new Float32Array(object.transforms.scale ?
                Matrix4x4.getScaleMatrix(
                    object.transforms.scale.x, 
                    object.transforms.scale.y, 
                    object.transforms.scale.z ).toWebGLArray() : 
                new Matrix4x4().toWebGLArray()
            )
        ),

        gl.uniformMatrix4fv(rotationMatrix,
            gl.FALSE, new Float32Array(object.transforms.rotate ?
                Matrix4x4.getRotationMatrix(
                    object.transforms.rotate.angle, 
                    object.transforms.rotate.x, 
                    object.transforms.rotate.y,
                    object.transforms.rotate.z ).toWebGLArray() :
                new Matrix4x4().toWebGLArray()
            )
        );
        // Set the varying normal vectors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);  
        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);  
        gl.drawArrays(object.mode, 0, object.vertices.length/3);
    };
    // Display the objects. Now accounts for an arbitrary tree of subshapes with recursion.
    var drawSubshapes = function (objects) {   
        for (i = 0; i < objects.length; ++i) {    
			drawObject(objects[i]);			
            if (objects[i].subshapes) {
				for (var k = 0; k < objects[i].subshapes.length; k++) {
                    drawObject(objects[i].subshapes[k]);
			    }
            }
        } 
    }; 

    /*
     * Displays the scene.
     */
    var drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(cameraMatrix,
            gl.FALSE, new Float32Array(
                Matrix4x4.lookAt(
                    camPosition,                //Location of camera
                    camPointer,                 //Where camera is pointed
                    new Vector(0.0, 1.0, 0.0)   //Tilt of camera
                ).toWebGLArray()
            )
        );

        //Set up frustum projection matrix (t, b, l, r, n, f)                                
        gl.uniformMatrix4fv(projectionMatrix,
            gl.FALSE, new Float32Array(
                Matrix4x4.frustum(5, -3, -5, 5, 10, 1000).toWebGLArray()
            )
        );

        drawSubshapes(objectsToDraw);
     
        // All done.
        gl.flush();
    };

    // Set up our one light source and its colors.
    gl.uniform4fv(lightPosition, [500.0, 1000.0, 100.0, 1.0]);   //Position of light
    gl.uniform3fv(lightDiffuse, [1.0, 1.0, 1.0]);    //Color of Light
    gl.uniform3fv(lightSpecular, [1.0, 1.0, 1.0]);   //Color of spot light

    // Draw the initial scene.
    drawScene();

    $("body").keydown(function(event) {
        if (event.keyCode === 38  || event.keyCode === 87) {  //Up key
            cameraX += ((camPointer.subtract(camPosition)).unit()).x();   
            cxPointer += ((camPointer.subtract(camPosition)).unit()).x();
            cameraZ += ((camPointer.subtract(camPosition)).unit()).z();
            czPointer += ((camPointer.subtract(camPosition)).unit()).z();
            //Simulates "jogging" by changing the camera position in the Y-axis - 10 degree increments
            if (pitAngle > 360) {
                pitAngle = 0;
            }
            cameraY = 3.0 + Math.abs(Math.sin(pitAngle * Math.PI / 180.0));
            cyPointer = 3.0 + Math.abs(Math.sin(pitAngle * Math.PI / 180.0));
            pitAngle += 8;    //Magic number for a smooth "jogging" simulation.
            udEvent = true;

        } else if (event.keyCode === 40 || event.keyCode === 83) {  //Down key
            cameraX -= ((camPointer.subtract(camPosition)).unit()).x();  
            cxPointer -= ((camPointer.subtract(camPosition)).unit()).x();
            cameraZ -= ((camPointer.subtract(camPosition)).unit()).z();
            czPointer -= ((camPointer.subtract(camPosition)).unit()).z();
             //Simulates "jogging" by changing the camera position in the Y-axis - 10 degree increments
            if (pitAngle > 360) {
                pitAngle = 0;
            }
            cameraY = 3.0 + Math.abs(Math.sin(pitAngle * Math.PI / 180.0));
            cyPointer = 3.0 + Math.abs(Math.sin(pitAngle * Math.PI / 180.0));
            pitAngle += 10;
            udEvent = true;

        } else if (event.keyCode === 37 || event.keyCode === 65) {  //Left key
            alpha -= 3.0;
            lrEvent = true;

        } else if (event.keyCode === 39 || event.keyCode === 68) {  //Right key
            alpha += 3.0;
            lrEvent = true;
        } 

        if (Math.abs( alpha ) >= 360.0) {
            alpha = 0.0;
        }

        if (udEvent) {
            udEvent = false;
            drawScene();
            event.preventDefault();
        }

        if (lrEvent) {
            lrEvent = false;
            alphaRads = alpha * Math.PI / 180.0; //Radians value of alpha
            cxPointer = cameraX + viewRadius * Math.sin( alphaRads );  
            czPointer = cameraZ - viewRadius * Math.cos( alphaRads );
            drawScene();
            event.preventDefault();
        }
            
        //Reinitialize camera position vector and camera pointer vectors with new values...
        camPosition = new Vector(cameraX, cameraY, cameraZ);                 
        camPointer = new Vector(cxPointer, cyPointer, czPointer);            
    });
	
	//Function for finding the distance between two points (the zombies and the camera position).
	var getDistance = function(x1,y1,x2,y2) {
		return Math.sqrt(Math.pow((x1-y1),2) + Math.pow((x2-y2),2));
	}
	
	// Assigns randomly generated translation values to the zombie objects and subshapes from -1 to 1.
	var animate = function() {
		for (var i = 0; i < objectsToDraw.length; i++) {
			var randX = Math.random() * 2 - 1
			var randZ = Math.random() * 2 - 1
			if (objectsToDraw[i].undead) {
				objectsToDraw[i].transforms.trans.x += randX;
				objectsToDraw[i].transforms.trans.z += randZ;
				if (objectsToDraw[i].subshapes) {
				    for (var j = 0; j < objectsToDraw[i].subshapes.length; j++) {
					    objectsToDraw[i].subshapes[j].transforms.trans.x += randX;
				        objectsToDraw[i].subshapes[j].transforms.trans.z += randZ;
				    }
			    }
			}
			var zX = zX + randX;
			var zZ = zZ + randZ;
			zombieLocation = new Vector (zX, 0.0, zZ)
		}
	}
var tooClose = false;
//Runs when the user clicks the screen...
   // $(canvas).click(function () {
//Convert to requestAnimationFrame - this will enable a smoother animation!!!
        main = setInterval(function () {
			//Need to update the actual vertices, NOT the zX and zZ values. These are only used when the objectsToDraw array is created.
			//(which is a while up the code)
			//ADD CODE HERE: Zombies are stationary, if camPosition is <= 10 units from any zombie, the zombies start moving. If farther, they stop.
			for (var i = 0; i < objectsToDraw.length; i++) {
				console.log("here3");
				if (objectsToDraw[i].undead) {
					console.log("here");
					if (getDistance(objectsToDraw[i].transforms.trans.x, objectsToDraw[i].transforms.trans.z,
					camPosition.x(),camPosition.z()) < 10) {
						tooClose = true;
					}
				}
			}
			if (tooClose) { animate() };
//			console.log("animating!");
//			animate();
            console.log("here2");
            drawScene();
        }, 200);
   // });
}(document.getElementById("space-scene")));