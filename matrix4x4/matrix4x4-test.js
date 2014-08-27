/*
 * Unit tests for our matrix4x4 object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        var m = new Matrix4x4();
        deepEqual(m.elements,
                [ 1, 0, 0, 0, 
                  0, 1, 0, 0, 
                  0, 0, 1, 0,
                  0, 0, 0, 1 ],
                "Default 4x4 Matrix Constructed");
    }); 


    test("4x4 Matrix Multiplication", function () {
        var m1 = new Matrix4x4();
        var m2 = new Matrix4x4();
        deepEqual(m1.multiply(m2).elements,
                [ 1, 0, 0, 0, 
                  0, 1, 0, 0, 
                  0, 0, 1, 0,
                  0, 0, 0, 1 ],
                "Default 4x4 Matrix Multiplied");

        m1 = new Matrix4x4(
            0.866,  -0.5, 0.0, 0.0,
              0.5, 0.866, 0.0, 0.0,
              0.0,   0.0, 1.0, 0.0,
              0.0,   0.0, 0.0, 1.0
        );

        m2 = new Matrix4x4(
            1.0, 0.0, 0.0, 0.0,
            0.0, 2.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );

        deepEqual(m1.multiply(m2).elements,
            [ 0.866,  -1.0, 0.0, 0.0,
                0.5, 1.732, 0.0, 0.0,
                0.0,   0.0, 1.0, 0.0,
                0.0,   0.0, 0.0, 1.0 ],
            "Typical 4x4 Matrix Multiplication"
        );
    });


    test("Pure Transformation Matrices", function () {
        var m = Matrix4x4.getTranslationMatrix(5, 9, -1);
        deepEqual(m.elements,
            [1.0, 0.0, 0.0,  5.0,
             0.0, 1.0, 0.0,  9.0,
             0.0, 0.0, 1.0, -1.0,
             0.0, 0.0, 0.0,  1.0 ],
            "Pure Translation Matrix");

        m = Matrix4x4.getScaleMatrix(2, 5, 21);
        deepEqual(m.elements,
            [2.0, 0.0,  0.0, 0.0,
             0.0, 5.0,  0.0, 0.0,
             0.0, 0.0, 21.0, 0.0,
             0.0, 0.0,  0.0, 1.0 ],
            "Pure Scale Matrix");

        m = Matrix4x4.getRotationMatrix(30, 0, 0, 1);
        deepEqual(m.elements,
            [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6), 0.0, 0.0,
             Math.sin(Math.PI / 6),  Math.cos(Math.PI / 6), 0.0, 0.0,
                               0.0,                    0.0, 1.0, 0.0,
                               0.0,                    0.0, 0.0, 1.0 ],
            "Rotation by 30 degrees about the z-axis");
    });


    test("WebGL Conversion Test", function () {
        var m = new Matrix4x4(
                 5, 0, 2, 3,
                 4, 1, 8, 9,
                10, 0, 0, 1,
                 0, 0, 0, 1
            );
        deepEqual(m.toWebGLArray(),
            [ 5, 4, 10, 0,
              0, 1,  0, 0,
              2, 8,  0, 0,
              3, 9,  1, 1 ],
            "WebGL Converted 4x4 Matrix");

    });


    test("Orthogonal Projection Matrices", function () {
        m = Matrix4x4.ortho(3, 1, 2, 1, 1, 2);
        deepEqual(m.elements,
            [ -2.0, 0.0,  0.0,  3.0,
               0.0, 1.0,  0.0, -2.0,
               0.0, 0.0, -2.0, -3.0,
               0.0, 0.0,  0.0,  1.0 ],
            "Orthogonal Projection Matrix");
    });


    test("Frustum Projection Matrices", function () {
        m = Matrix4x4.frustum(3, 1, 2, 1, 1, 2);
        deepEqual(m.elements,
            [ -2.0, 0.0, -3.0,  0.0,
               0.0, 1.0,  2.0,  0.0,
               0.0, 0.0, -3.0, -4.0,
               0.0, 0.0, -1.0,  0.0 ],
            "Frustum Projection Matrix");
    });

    test("lookAt Camera Matrices", function () {
        var p = new Vector(0, 1, 0),
            q = new Vector(0, 0, 0),
            up = new Vector(1, 0, 0);
        m = Matrix4x4.lookAt(p, q, up);
        deepEqual(m.elements,
            [ 0.0, 0.0, 1.0,  0.0,
              1.0, 0.0, 0.0,  0.0,
              0.0, 1.0, 0.0, -1.0,
              0.0, 0.0, 0.0,  1.0 ],
            "lookAt Camera Matrix");
    });
});
