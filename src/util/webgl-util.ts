export class WebGLUtil{
  public static createShader(gl: WebGLRenderingContext, shaderType: GLenum, source: string): WebGLShader{
    var shader: WebGLShader = gl.createShader(shaderType) as WebGLShader;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!success){
      gl.deleteShader(shader);
      throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }

    return shader;
  }

  public static createProgram(gl: WebGLRenderingContext, fragmentShader: WebGLShader, vertexShader: WebGLShader): WebGLProgram{
    var program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!success) {
      gl.deleteProgram(program);
      throw "program failed to link:" + gl.getProgramInfoLog (program);
    }

    return program;
  }
}