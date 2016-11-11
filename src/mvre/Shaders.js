/**
 * Created by ubufu on 11/9/2016.
 */

var prototype_vshader =
    `#version 300 es
                
                precision mediump float;
                in vec3 a_Position;
                in vec2 t_coord;
                uniform mat4 projectionMat;
                uniform mat4 modelViewMat;
                uniform mat4 transMat;
                out vec2 t_coords;
                out float fs_depth;
                out vec4 fs_Position;
                void main() {
                    fs_Position = modelViewMat * transMat * vec4(a_Position, 1.0);
                    gl_Position = projectionMat * fs_Position;
                    t_coords = t_coord;
                    fs_depth = ((gl_Position.z / gl_Position.w));
                }
                `;

var prototype_fshader =
    `#version 300 es
                
                precision mediump float;
                in vec2 t_coords;
                in float fs_depth;
                in vec4 fs_Position; 
                uniform sampler2D uSampler;
                layout(location = 0) out vec4 frag_0;
                layout(location = 1) out vec4 frag_1;
                layout(location = 2) out vec4 frag_2;
                void main() {
                        //position, depth, color
                    frag_0 = vec4(vec3(fs_depth), 1.0);
                    frag_1 = fs_Position;
                    frag_2 = vec4(texture(uSampler, t_coords).xyz, 1.0);
                }
                `;