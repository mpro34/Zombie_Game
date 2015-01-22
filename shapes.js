/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */
var Shapes = {
    /*
     * Returns the vertices for a small icosahedron.
     */
    icosahedron: function () {
        // These variables are actually "constants" for icosahedron coordinates.
        var X = 0.525731112119133606,
            Z = 0.850650808352039932;

        return {
            vertices: [
                [ -X, 0.0, Z ],
                [ X, 0.0, Z ],
                [ -X, 0.0, -Z ],
                [ X, 0.0, -Z ],
                [ 0.0, Z, X ],
                [ 0.0, Z, -X ],
                [ 0.0, -Z, X ],
                [ 0.0, -Z, -X ],
                [ Z, X, 0.0 ],
                [ -Z, X, 0.0 ],
                [ Z, -X, 0.0 ],
                [ -Z, -X, 0.0 ]
            ],

            indices: [
                [ 1, 4, 0 ],
                [ 4, 9, 0 ],
                [ 4, 5, 9 ],
                [ 8, 5, 4 ],
                [ 1, 8, 4 ],
                [ 1, 10, 8 ],
                [ 10, 3, 8 ],
                [ 8, 3, 5 ],
                [ 3, 2, 5 ],
                [ 3, 7, 2 ],
                [ 3, 10, 7 ],
                [ 10, 6, 7 ],
                [ 6, 11, 7 ],
                [ 6, 0, 11 ],
                [ 6, 1, 0 ],
                [ 10, 1, 6 ],
                [ 11, 0, 9 ],
                [ 2, 11, 9 ],
                [ 5, 2, 9 ],
                [ 11, 2, 7 ],
                [ 11, 5, 3 ],
                [ 5, 0, 10 ]
            ]
        };
    },


    //Cube shape with 8 vertices, 12 edges, and 6 faces
    hexahedron: function () {
        var X = 0.5,
            Z = 0.25;

        return {
            vertices: [
                [ -Z, 0.0, 0.0 ], //0
                [ Z, 0.0, 0.0 ],  //1
                [ -Z, X, 0.0 ], //2
                [ Z, X, 0.0 ],  //3
                [ Z, X, X ],      //4
                [ -Z, X, X ],      //5
                [ Z, 0.0, X ],   //6
                [ -Z, 0.0, X ]     //7

            ],

            indices: [
                [ 0, 1, 3 ],   //Front Face
                [ 3, 2, 0 ],  
                [ 1, 3, 4 ],  //Right Face
                [ 4, 6, 1 ],  
                [ 0, 2, 7 ],  //Left Face
                [ 5, 2, 7 ],
                [ 4, 6, 7 ],  //Back Face
                [ 7, 5, 4 ],
                [ 2, 5, 4 ],  //Top Face
                [ 2, 3, 4 ],   
                [ 0, 1, 6 ],  //Bottom Face
                [ 0, 7, 6 ]  
            ]
        };
    },

    //Pyramid shape with 4 vertices, 6 edges, and 4 faces
    tetrahedron: function () {
        var X = 0.5,
            Z = 0.25;

        return {
            vertices: [
                [ -Z, 0.0, Z ], //0
                [ Z, 0.0, Z ],  //1
                [ 0.0, X, 0.0 ], //2
                [ 0.0, 0.0, -Z ],  //3
            ],

            indices: [
                [ 0, 1, 2 ],   //front
                [ 1, 3, 2 ],   //right
                [ 0, 3, 2 ],   //left
                [ 0, 1, 3 ]    //bot
            ]
        };
    },


    sphere: function () {
        var latitudeBands = 30,
            longitudeBands = 30,
            i,
			Z = 0.25,
			X = 0.5,
            vertexPositionData = [],
            indicePositionData = [];
        /*
         Generate vertex data
        */
        for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
 
            for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);
 
                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                var u = 1- (longNumber / longitudeBands);
                var v = latNumber / latitudeBands;
 
                vertexPositionData.push([x, y, z]);
            }
        }
        /*
         Connect vertices with generated indices that create traingles around the sphere
        */
        for (i = 0; i < vertexPositionData.length-(latitudeBands+2); i += 1) {
            indicePositionData.push( 
                                    [i, i + 1, i + latitudeBands + 1],
                                    [i + 1, i + latitudeBands + 1, i + latitudeBands + 2]
                                   );    
        }
        return {
            vertices: [
                [ -Z, 0.0, 0.0 ], //0
                [ Z, 0.0, 0.0 ],  //1
                [ -Z, X, 0.0 ], //2
                [ Z, X, 0.0 ],  //3
                [ Z, X, X ],      //4
                [ -Z, X, X ],      //5
                [ Z, 0.0, X ],   //6
                [ -Z, 0.0, X ]].concat(vertexPositionData),
            indices: [
                [ 0, 1, 7 ],   //Front Face
                [ 7, 2, 0 ],  
                [ 1, 3, 4 ],  //Right Face
                [ 4, 7, 1 ],  
                [ 0, 2, 7 ],  //Left Face
                [ 5, 2, 7 ],
                [ 4, 16, 7 ],  //Back Face
                [ 7, 5, 4 ],
                [ 2, 5, 4 ],  //Top Face
                [ 7, 3, 4 ],   
                [ 0, 1, 6 ],  //Bottom Face
                [ 0, 7, 6 ] ].concat(indicePositionData) 
        }
    },

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as triangles.
     */
    toRawTriangleArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ]
                );
            }
        }

        return result;
    },

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as line segments.
     */
    toRawLineArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj;

        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ],

                    indexedVertices.vertices[
                        indexedVertices.indices[i][(j + 1) % maxj]
                    ]
                );
            }
        }

        return result;
    },

    /*
     * Another utility function for computing normals, this time just converting
     * every vertex into its unit vector version.  This works mainly for objects
     * that are centered around the origin. Gets rid of edges!
     */
    toVertexNormalArray: function (indexedVertices) {
        var result = [],
            i,
            j,
            maxi,
            maxj,
            p,
            normal;

        // For each face...
        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // For each vertex in that face...
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                p = indexedVertices.vertices[indexedVertices.indices[i][j]];
                normal = new Vector(p[0], p[1], p[2]).unit();
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
                );
            }
        }

        return result;
    },

    /*
     * For debugging purposes, a mesh integrity checker.  This function iterates
     * through an indexedVertices object and makes sure that all of its faces
     * refer to valid vertices.
     */
    checkMeshValidity: function (indexedVertices) {
        var i, maxi, j, maxj,
            vertexIndex, vertex,
            valid = true;

        // For each face...
        for (i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // For each vertex in the face...
            for (j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                // Grab the referenced vertex.
                vertexIndex = indexedVertices.indices[i][j];
                vertex = indexedVertices.vertices[vertexIndex];

                // Is it valid?
                if (!vertex) {
                    valid = false;
                    console.log("!!!!!!!! Bad face vertex found!");
                    console.log("Face index: " + i);
                    console.log("Index within the face: " + j);
                    console.log("vertex index: " + vertexIndex);
                    console.log("vertex value: " + vertex);
                }
            }
        }

        // If a vertex did not "pass," we log the mesh for closer examination.
        if (!valid) {
            console.log("-------> Here's the whole mesh so you can study it:");
            console.log(indexedVertices);
        }
    }

};
