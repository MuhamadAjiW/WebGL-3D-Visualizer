import { BufferAttribute } from "../class/geometry";
import { ProgramInfo } from "./webgl-program-info";

type AttributeSingleDataType = BufferAttribute | Float32Array | number[];
type AttributeDataType = [AttributeSingleDataType] | number[];
type AttributeSetters = (...v: AttributeDataType) => void;
type AttributeMapSetters = {[key: string]: AttributeSetters};

function createAttributeSetters(gl: WebGLRenderingContext, program: WebGLProgram): AttributeMapSetters {
    function createAttributeSetter(info: WebGLActiveInfo): AttributeSetters {
        // Initialization Time
        const loc = gl.getAttribLocation(program, info.name);
        const buf = gl.createBuffer();
        return (...values) => {
            // Render Time (saat memanggil setAttributes() pada render loop)
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            const v = values[0];
            if (v instanceof BufferAttribute) {
                if (v.isDirty) {
                    // Data Changed Time (note that buffer is already binded)
                    gl.bufferData(gl.ARRAY_BUFFER, v.data, gl.STATIC_DRAW);
                    v.consume();
                }
                gl.enableVertexAttribArray(loc);
                gl.vertexAttribPointer(loc, v.size, v.dtype, v.normalize, v.stride, v.offset);
            } else {
                // TODO: Fix, even though this is from the guidebook, This is seems faulty
                gl.disableVertexAttribArray(loc);
                if (v instanceof Float32Array){
                    (gl as any)[`vertexAttrib${v.length}fv`](loc, v);
                }
                else{
                    (gl as any)[`vertexAttrib${values.length}f`](loc, ...values);
                }
            }
        }
    }


    const attribSetters: any = {};
    const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttribs; i++) {
        const info = gl.getActiveAttrib(program, i);
        if (!info) continue;
        attribSetters[info.name] = createAttributeSetter(info);
    }
    return attribSetters;
}

function setAttribute(programInfo: ProgramInfo, attributeName: string, ...data: AttributeDataType) {
    const setters = programInfo.attributeSetters;
    if (attributeName in setters) {
        setters[attributeName](...data);
    }
}
function setAttributes(
    programInfo: ProgramInfo,
    attributes: {[attributeName: string]: AttributeSingleDataType},
) {
    for (let attributeName in attributes)
        setAttribute(programInfo, attributeName, attributes[attributeName]);
}

export type { AttributeMapSetters };
export { setAttributes, setAttribute, createAttributeSetters };