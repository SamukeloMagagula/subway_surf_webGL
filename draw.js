function clearScene(gl, translate) {

  gl.clearColor(0.52, 0.80, 0.97, 1.0); 
  gl.clearDepth(1.0); 
  gl.enable(gl.DEPTH_TEST); 
  gl.depthFunc(gl.LEQUAL); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // perspective matrix to camera

  const fieldOfView = 45 * Math.PI / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 1000.0;
  const projectionMatrix = mat4.create();

  // glmatrix.js always has the first argument

  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);

  

  return projectionMatrix;

}


function drawScene(gl, programInfo, buffers, deltaTime, projectionMatrix, object, texture) {

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  // Set the drawing position to the "identity" point, which is the center of the scene.
  const modelViewMatrix = mat4.create();

  
  mat4.translate(modelViewMatrix, 
    modelViewMatrix, 
    object.translate); 


  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    object.rotation,
    [0, 1, 0]); // axis to rotate around

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);
  }

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(
        programInfo.attribLocations.textureCoord);
    }


  // Tell WebGL how to pull out the normals from
  // the normal buffer into the vertexNormal attribute.
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexNormal);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix);

    
    gl.activeTexture(gl.TEXTURE0);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    
    gl.uniform1i(programInfo.uniformLocations.texture0, 0);
    gl.uniform1i(programInfo.uniformLocations.flash, flash);
    gl.uniform1i(programInfo.uniformLocations.gray, gray);

  {
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, object.vertexCount, type, offset);
  }

}
