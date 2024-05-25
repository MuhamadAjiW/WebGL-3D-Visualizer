import { Euler } from "@/libs/base-types/euler";
import { Quaternion } from "@/libs/base-types/quaternion";
import Vector3 from "@/libs/base-types/vector3";
import { PhongMaterial } from "@/libs/class/material/phong-material";
import { Mesh } from "@/libs/class/mesh";
import Object3D from "@/libs/class/object3d";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useRef } from "react";
import { Collapse } from "react-collapse";
import { GoChevronDown, GoChevronRight } from "react-icons/go";

interface ControllerProps {
  id: string;
  isExpanded: boolean;
  handleClick: () => void;
  title: string;
  component: Object3D;
  handleSubmit: (values: any) => void;
  setIsControllerChange: Dispatch<SetStateAction<boolean>>;
  isControllerChange: boolean
}

const ComponentController: React.FC<ControllerProps> = ({
  id,
  isExpanded,
  handleClick,
  title,
  component,
  handleSubmit,
  setIsControllerChange,
  isControllerChange,
}) => {
  // TODO: setFromQuaternion is a little off here for some reason on the y axis at 90 degrees
  // The quick fix is just to only load it whenever the components reset so uhh
  const savedComponent = useRef<Object3D | null>(null);
  const rotation = useRef<Vector3>(Vector3.zero);
  const position = useRef<Vector3>(Vector3.zero);
  const scale = useRef<Vector3>(Vector3.one);
  const name = useRef<string>("");
  const normal = useRef<boolean>(false);
  const parallax = useRef<boolean>(false);
  const smoothShade = useRef<boolean>(false);
  const visible = useRef<boolean>(false);
  const parallaxHeight = useRef<number>(0.1);

  if (component && component != savedComponent.current) {
    console.log("This is component", component);
    savedComponent.current = component;

    const euler = new Euler();
    euler.setFromQuaternion(component.rotation as Quaternion);
    rotation.current = euler.toVector3Degrees();
    position.current = component.position;
    scale.current = component.scale;
    name.current = component.name;
    visible.current = component.visible;

    if(component instanceof Mesh){
      normal.current = component.material.useNormalTex;
      parallax.current = component.material.useParallaxTex;
      smoothShade.current = component.geometry.smoothShade;
      parallaxHeight.current = component.material.parallaxScale;
    }
  }

  const formik = useFormik({
    initialValues: {
      name: name.current,
      position: {
        x: position.current.x,
        y: position.current.y,
        z: position.current.z,
      },
      rotation: {
        x: rotation.current.x,
        y: rotation.current.y,
        z: rotation.current.z,
      },
      scale: {
        x: scale.current.x,
        y: scale.current.y,
        z: scale.current.z,
      },
      light: {
        x: 0,
        y: 0,
        z: 0,
      },
      // normalTexture: normalTexture.current,
      // parallaxTexture: parallaxTexture.current,
      // diffuseTexture: diffuseTexture.current,
      // specularTexture: specularTexture.current,
      // ambientColors: "",
      isNormal: normal.current,
      isVisible: visible.current,
      isParallax: parallax.current,
      isSmoothShading: smoothShade.current,
      parallaxHeight: parallaxHeight.current,
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
    enableReinitialize: true,
  });

  const refresh = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    formik.submitForm();
  };

  const handleNormalTextureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target?.result as string;
        const image_path = "res/" + file.name;

        if (component instanceof Mesh) {
          component.material.normalTexture.image = image;
          component.material.normalTexture.image_path = image_path;
          component.material.setNeedsUpdate();
        }
      };
      reader.readAsDataURL(file);
      console.log(isControllerChange);
      setIsControllerChange(!isControllerChange);
    }
  };

  const handleParallaxTextureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target?.result as string;
        const image_path = "res/" + file.name;

        if (component instanceof Mesh) {
          component.material.parallaxTexture.image = image;
          component.material.parallaxTexture.image_path = image_path;
          component.material.setNeedsUpdate();
        }
      };
      reader.readAsDataURL(file);
      setIsControllerChange(!isControllerChange);
    }
  };

  const handleDiffuseTextureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target?.result as string;
        const image_path = "res/" + file.name;

        if (
          component instanceof Mesh
        ) {
          console.log("Changing diffuse texture");
          (component.material as any).diffuseTexture.image = image;
          (component.material as any).diffuseTexture.image_path = image_path;
          component.material.setNeedsUpdate();
        }
      };
      reader.readAsDataURL(file);
      setIsControllerChange(!isControllerChange);
    }
  };

  const handleSpecularTextureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target?.result as string;
        const image_path = "res/" + file.name;

        if (
          component instanceof Mesh &&
          component.material instanceof PhongMaterial
        ) {
          component.material.specularTexture.image = image;
          component.material.specularTexture.image_path = image_path;
          component.material.setNeedsUpdate();
        }
      };
      reader.readAsDataURL(file);
      setIsControllerChange(!isControllerChange);
    }
  };

  return (
    <>
      {component && (
        <div className="w-full py-2" id={id}>
          <div
            className="cursor-pointer flex gap-2 items-center"
            onClick={handleClick}
          >
            <div>{isExpanded ? <GoChevronDown /> : <GoChevronRight />}</div>
            <div>{title}</div>
          </div>
          <Collapse isOpened={isExpanded}>
            <div className="px-6 py-4 flex flex-col gap-5">
              <div className="flex items-center gap-3 w-full">
                <div className="w-1/4">Name</div>
                <div className="w-3/4">
                  <TextField
                    id="name"
                    name="name"
                    fullWidth
                    className="bg-white"
                    size="small"
                    onChange={refresh}
                    value={formik.values.name}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Position</div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 items-center">
                    <div>X</div>
                    <TextField
                      id="position.x"
                      name="position.x"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.position.x}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="position.y"
                      name="position.y"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.position.y}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="position.z"
                      name="position.z"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.position.z}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Rotation</div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 items-center">
                    <div>X</div>
                    <TextField
                      id="rotation.x"
                      name="rotation.x"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.rotation.x}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="rotation.y"
                      name="rotation.y"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.rotation.y}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="rotation.z"
                      name="rotation.z"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.rotation.z}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Scale</div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 items-center">
                    <div>X</div>
                    <TextField
                      id="scale.x"
                      name="scale.x"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.scale.x}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="scale.y"
                      name="scale.y"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.scale.y}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="scale.z"
                      name="scale.z"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.scale.z}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Global Light</div>
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1 items-center">
                    <div>X</div>
                    <TextField
                      id="light.x"
                      name="light.x"
                      type="number"
                      fullWidth
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.light.x}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Y</div>
                    <TextField
                      id="light.y"
                      name="light.y"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.light.y}
                    />
                  </div>
                  <div className="flex gap-1 items-center">
                    <div>Z</div>
                    <TextField
                      id="light.z"
                      name="light.z"
                      fullWidth
                      type="number"
                      className="bg-white"
                      size="small"
                      onChange={refresh}
                      value={formik.values.light.z}
                    />
                  </div>
                </div>
              </div>
              {component &&
                component instanceof Mesh &&
                component.material instanceof PhongMaterial && (
                  <div className="flex items-center justify-between">
                    <div>Ambient Color</div>
                    <div>
                      <input
                        id="ambientColors"
                        name="ambientColors"
                        type="color"
                        // value={formik.values.ambientColors}
                        onChange={refresh}
                      />
                    </div>
                  </div>
                )}
              <FormGroup>
                <div className="grid grid-cols-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "silver",
                          },
                        }}
                        checked={formik.values.isVisible}
                        onChange={refresh}
                        name="isVisible"
                        id="isVisible"
                      />
                    }
                    label="Visible"
                  ></FormControlLabel>
                  {component &&
                  component instanceof Mesh &&
                  component.material instanceof PhongMaterial && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "silver",
                          },
                        }}
                        checked={formik.values.isNormal}
                        onChange={refresh}
                        name="isNormal"
                        id="isNormal"
                      />
                    }
                    label="Normal"
                  ></FormControlLabel>
                  )}
                  {component &&
                  component instanceof Mesh &&
                  component.material instanceof PhongMaterial && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "silver",
                          },
                        }}
                        checked={formik.values.isParallax}
                        onChange={refresh}
                        name="isParallax"
                        id="isParallax"
                      />
                    }
                    label="Parallax"
                  ></FormControlLabel>
                  )}
                  {component &&
                  component instanceof Mesh &&
                  component.material instanceof PhongMaterial && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "silver",
                          },
                        }}
                        checked={formik.values.isSmoothShading}
                        onChange={refresh}
                        name="isSmoothShading"
                        id="isSmoothShading"
                      />
                    }
                    label="Smooth"
                  ></FormControlLabel>
                  )}
                </div>
              </FormGroup>
              {component &&
                component instanceof Mesh && (
                <div className="flex items-center justify-between">
                  <div>Material</div>
                  <FormControl
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                    className="bg-white"
                  >
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={10}
                      label="Age"
                      onChange={() => {}}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              )}
              {component &&
                component instanceof Mesh &&
                component.material instanceof PhongMaterial && 
                component.material.useParallaxTex && (
                <div className="flex items-center justify-between">
                  <div className="pr-4">Height</div>
                  <TextField
                    id="parallaxHeight"
                    name="parallaxHeight"
                    fullWidth
                    type="number"
                    className="bg-white"
                    size="small"
                    onChange={refresh}
                    value={formik.values.parallaxHeight}
                  />
                </div>
              )}

              {component instanceof Mesh && component.material instanceof PhongMaterial && (
              <div className="flex flex-col gap-2">
                <div>Normal Texture</div>
                  <div className="flex justify-center mb-2">
                    <img
                      src={component.material.normalTexture.image_path}
                      alt="Current Texture"
                      className="max-w-full max-h-32"
                    />
                  </div>
                  <Button variant="contained" component="label">
                    Normal Texture
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleNormalTextureChange}
                    />
                  </Button>
              </div>
              )}


              {component instanceof Mesh && component.material instanceof PhongMaterial && (
              <div className="flex flex-col gap-2">
                <div>Parallax Texture</div>
                  <div className="flex justify-center mb-2">
                    <img
                      src={component.material.parallaxTexture.image_path}
                      alt="Current Texture"
                      className="max-w-full max-h-32"
                    />
                  </div>
                  <Button variant="contained" component="label">
                    Parallax Texture
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleParallaxTextureChange}
                    />
                  </Button>
              </div>
              )}

              {component instanceof Mesh && (
              <div className="flex flex-col gap-2">
                <div>Diffuse Texture</div>

                <div className="flex justify-center mb-2">
                  <img
                    src={(component.material as any).diffuseTexture.image_path}
                    alt="Current Texture"
                    className="max-w-full max-h-32"
                  />
                </div>
                <Button variant="contained" component="label">
                  Diffuse Texture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleDiffuseTextureChange}
                  />
                </Button>
              </div>
              )}

              {component instanceof Mesh && component.material instanceof PhongMaterial && (
              <div className="flex flex-col gap-2">
                <div>Specular Texture</div>
                <div className="flex justify-center mb-2">
                  <img
                    src={component.material.specularTexture.image_path}
                    alt="Current Texture"
                    className="max-w-full max-h-32"
                  />
                </div>
                <Button variant="contained" component="label">
                  Specular Texture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleSpecularTextureChange}
                  />
                </Button>
              </div>
              )}
            </div>
          </Collapse>
        </div>
      )}
    </>
  );
};

export default ComponentController;
