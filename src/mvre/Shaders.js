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
                out vec4 posBasedColor;
                out vec2 t_coords;
                void main() {
                    posBasedColor = modelViewMat * transMat * vec4(a_Position, 1.0);
                    gl_Position = projectionMat * posBasedColor;
                    t_coords = t_coord;
                }
                `;

var prototype_fshader =
    `#version 300 es
                
                precision mediump float;
                in vec4 posBasedColor;
                in vec2 t_coords;
                uniform sampler2D uSampler;
                out vec4 outColor;
                void main() {
                    outColor = texture(uSampler, vec2(t_coords.s, t_coords.t)); // Set the point color
                }
                `;