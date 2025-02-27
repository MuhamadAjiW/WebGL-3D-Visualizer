import { Euler } from "@/libs/base-types/euler";
import { Quaternion } from "@/libs/base-types/quaternion";
import Vector3 from "@/libs/base-types/vector3";
import { PhongMaterial } from "@/libs/class/material/phong-material";
import { ShaderMaterial } from "@/libs/class/material/shader-material";
import { Mesh } from "@/libs/class/mesh";
import Object3D from "@/libs/class/object3d";
import { InputOptions } from "@/types/ui";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useRef } from "react";
import { Collapse } from "react-collapse";
import { GoChevronDown, GoChevronRight } from "react-icons/go";
import UIButton from "../ui/Button";
import { BasicMaterial } from "@/libs/class/material/basic-material";
import { MuiColorInput } from "mui-color-input";
import { Color } from "@/libs/base-types/color";

interface ControllerProps {
  id: string;
  isExpanded: boolean;
  handleClick: () => void;
  title: string;
  component: Object3D;
  materials: ShaderMaterial[] | null;
  light: Vector3;
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
  materials,
  light,
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
  const lightPos = useRef<Vector3>(Vector3.zero);
  const name = useRef<string>("");
  const normal = useRef<boolean>(false);
  const parallax = useRef<boolean>(false);
  const displacement = useRef<boolean>(false);
  const smoothShade = useRef<boolean>(false);
  const visible = useRef<boolean>(false);
  const parallaxHeight = useRef<number>(0.1);
  const displacementHeight = useRef<number>(0);
  const shininess = useRef<number>(0);
  const ambientColor = useRef<string>("#ffffffff");
  const diffuseColor = useRef<string>("#ffffffff");
  const specularColor = useRef<string>("#ffffffff");

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
      normal.current = component.material.normalActive;
      parallax.current = component.material.parallaxActive;
      smoothShade.current = component.geometry.smoothShade;
      parallaxHeight.current = component.material.parallaxHeight;
      displacement.current = component.material.displacementActive;
      displacementHeight.current = component.material.displacementHeight;

      if(component.material instanceof BasicMaterial){
        diffuseColor.current = component.material.diffuseColor.getHexString();
      }
      else if(component.material instanceof PhongMaterial){
        ambientColor.current = component.material.ambientColor.getHexString();
        diffuseColor.current = component.material.diffuseColor.getHexString();
        specularColor.current = component.material.specularColor.getHexString();
        shininess.current = component.material.shininess;
      }
    }

    lightPos.current.x = light.x;
    lightPos.current.y = light.y;
    lightPos.current.z = light.z;
  }

  let materialData: InputOptions[] = [];
  let materialIndex: number = 0;
  if(materials){
    materials.forEach((mat, index) => {
      let option: InputOptions = {
        name: mat.id,
        value: index
      };
      materialData.push(option);

      if(component instanceof Mesh && mat == component.material){
        materialIndex = index;
      }
    })
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
        x: lightPos.current.x,
        y: lightPos.current.y,
        z: lightPos.current.z,
      },

      ambientColor: ambientColor.current,
      diffuseColor: diffuseColor.current,
      specularColor: specularColor.current,
      
      shininess: shininess.current,
      visible: visible.current,
      normalActive: normal.current,
      smoothShade: smoothShade.current,
      parallaxActive: parallax.current,
      parallaxHeight: parallaxHeight.current,
      displacementActive: displacement.current,
      displacementHeight: displacementHeight.current,
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

  const handleMaterialChange = (e: SelectChangeEvent) => {
    if(component instanceof Mesh){
      const index = parseInt(e.target.value);
      component.material = materials![index];
      
      normal.current = component.material.normalActive;
      parallax.current = component.material.parallaxActive;
      smoothShade.current = component.geometry.smoothShade;
      parallaxHeight.current = component.material.parallaxHeight;
      displacement.current = component.material.displacementActive;
      displacementHeight.current = component.material.displacementHeight;
      
      formik.values.normalActive = component.material.normalActive;
      formik.values.parallaxActive = component.material.parallaxActive;
      formik.values.smoothShade = component.geometry.smoothShade;
      formik.values.parallaxHeight = component.material.parallaxHeight;
      formik.values.displacementActive = component.material.displacementActive;
      formik.values.displacementHeight = component.material.displacementHeight;

      if(component.material instanceof BasicMaterial){
        diffuseColor.current = component.material.diffuseColor.getHexString();
      }
      else if(component.material instanceof PhongMaterial){
        shininess.current = component.material.shininess;
        formik.values.shininess = component.material.shininess;

        ambientColor.current = component.material.ambientColor.getHexString();
        diffuseColor.current = component.material.diffuseColor.getHexString();
        specularColor.current = component.material.specularColor.getHexString();
        shininess.current = component.material.shininess;
      }
      
      setIsControllerChange(!isControllerChange);
    }
  }

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
    }
    setIsControllerChange(!isControllerChange);
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
    }
    setIsControllerChange(!isControllerChange);
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
          (component.material as any).diffuseTexture.image = image;
          (component.material as any).diffuseTexture.image_path = image_path;
          component.material.setNeedsUpdate();
        }
      };
      reader.readAsDataURL(file);
    }
    setIsControllerChange(!isControllerChange);
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
    }
    setIsControllerChange(!isControllerChange);
  };

  const handleDisplacementTextureChange = (
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
          component.material.displacementTexture.image = image;
          component.material.displacementTexture.image_path = image_path;
          component.material.setNeedsUpdate();
        }
      };
      reader.readAsDataURL(file);
    }
    setIsControllerChange(!isControllerChange);
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
                materials && (
                <div className="flex items-center justify-between">
                  <div>Material</div>
                  <FormControl
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                    className="bg-white"
                  >
                    <Select
                      value={materialIndex.toString()}
                      aria-label="Material selector"
                      onChange={handleMaterialChange}
                      size="small"
                    >
                    {materialData!.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </div>
              )}
              {component &&
                component instanceof Mesh && 
                materials && (
                <div className="flex items-center justify-between">
                    <UIButton
                      id="add-basic-mat"
                      text="Add Basic"
                      className="bg-white text-black py-1 px-4 rounded-sm"
                      handleClick={() => {
                        materials.push(new BasicMaterial());
                        setIsControllerChange(!isControllerChange);
                      }}
                    />
                    <UIButton
                      id="add-phong-mat"
                      text="Add Phong"
                      className="bg-white text-black py-1 px-4 rounded-sm"
                      handleClick={() => {
                        materials.push(new PhongMaterial());
                        setIsControllerChange(!isControllerChange);
                      }}
                    />
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
                        checked={formik.values.visible}
                        onChange={refresh}
                        name="visible"
                        id="visible"
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
                        checked={formik.values.normalActive}
                        onChange={refresh}
                        name="normalActive"
                        id="normalActive"
                      />
                    }
                    label="Normal"
                  ></FormControlLabel>
                  )}
                  {component &&
                  component instanceof Mesh && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "white",
                          "&.Mui-checked": {
                            color: "silver",
                          },
                        }}
                        checked={formik.values.displacementActive}
                        onChange={refresh}
                        name="displacementActive"
                        id="displacementActive"
                      />
                    }
                    label="Displace"
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
                        checked={formik.values.parallaxActive}
                        onChange={refresh}
                        name="parallaxActive"
                        id="parallaxActive"
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
                        checked={formik.values.smoothShade}
                        onChange={refresh}
                        name="smoothShade"
                        id="smoothShade"
                      />
                    }
                    label="Smooth"
                  ></FormControlLabel>
                  )}
                </div>
              </FormGroup>
              {component &&
                component instanceof Mesh &&
                component.material instanceof PhongMaterial && (
                <div className="flex items-center justify-between">
                  <div className="pr-4">Shininess</div>
                  <TextField
                    id="shininess"
                    name="shininess"
                    fullWidth
                    type="number"
                    className="bg-white"
                    size="small"
                    onChange={refresh}
                    value={formik.values.shininess}
                  />
                </div>
              )}
              {component &&
                component instanceof Mesh &&
                component.material instanceof PhongMaterial && 
                component.material.parallaxActive && (
                <div className="flex items-center justify-between">
                  <div className="pr-4">Parallax Height</div>
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
              {component &&
                component instanceof Mesh &&
                component.material.displacementActive && (
                <div className="flex items-center justify-between">
                  <div className="pr-4">Displacement Height</div>
                  <TextField
                    id="displacementHeight"
                    name="displacementHeight"
                    fullWidth
                    type="number"
                    className="bg-white"
                    size="small"
                    onChange={refresh}
                    value={formik.values.displacementHeight}
                  />
                </div>
              )}

              {component &&
              component instanceof Mesh &&
              component.material instanceof PhongMaterial && (
                <div className="flex items-center justify-between">
                  <div>Ambient Color</div>
                  <div>
                    <MuiColorInput
                      sx={{
                        input: {
                          color: "white",
                        }
                      }}
                      id="ambientColors"
                      name="ambientColors"
                      format="hex8"
                      value={formik.values.ambientColor}
                      onChange={(newValue) => {
                        formik.setFieldValue('ambientColor', newValue);
                        formik.submitForm();
                      }}
                    />
                  </div>
                </div>
              )}
              {component &&
              component instanceof Mesh && (
                <div className="flex items-center justify-between">
                  <div>Diffuse Color</div>
                  <div>
                    <MuiColorInput
                      sx={{
                        input: {
                          color: "white",
                        }
                      }}
                      id="diffuseColors"
                      name="diffuseColors"
                      format="hex8"
                      value={formik.values.diffuseColor}
                      onChange={(newValue) => {
                        formik.setFieldValue('diffuseColor', newValue);
                        formik.submitForm();
                      }}
                    />
                  </div>
                </div>
              )}
              {component &&
              component instanceof Mesh &&
              component.material instanceof PhongMaterial && (
                <div className="flex items-center justify-between">
                  <div>Specular Color</div>
                  <div>
                    <MuiColorInput
                      sx={{
                        input: {
                          color: "white",
                        }
                      }}
                      id="specularColors"
                      name="specularColors"
                      format="hex8"
                      value={formik.values.specularColor}
                      onChange={(newValue) => {
                        formik.setFieldValue('specularColor', newValue);
                        formik.submitForm();
                      }}
                    />
                  </div>
                </div>
              )}

              {component instanceof Mesh && (
              <div className="flex flex-col gap-2">
                <div>Diffuse Texture</div>

                {((component.material as any).diffuseTexture.image && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={(component.material as any).diffuseTexture.image_path}
                      alt="Current Texture"
                      className="max-w-full max-h-32"
                    />
                  </div>
                ))
                ||
                (
                  <div className="flex justify-center mb-2">
                    No texture loaded
                  </div>
                )}
                <Button variant="contained" component="label">
                  Insert Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleDiffuseTextureChange}
                  />
                </Button>
                <Button variant="contained" component="label"onClick={() => {
                      (component.material as any).diffuseActive = false;
                      (component.material as any).diffuseTexture.image = undefined;
                      (component.material as any).diffuseTexture.image_path = "";
                      component.material.setNeedsUpdate();
                      setIsControllerChange(!isControllerChange);
                    }}>
                  Remove
                </Button>
              </div>
              )}

              {component instanceof Mesh && (
              <div className="flex flex-col gap-2">
                <div>Displacement Texture</div>

                {(component.material.displacementTexture.image && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={component.material.displacementTexture.image_path}
                      alt="Current Texture"
                      className="max-w-full max-h-32"
                    />
                  </div>
                ))
                ||
                (
                  <div className="flex justify-center mb-2">
                    No texture loaded
                  </div>
                )}
                <Button variant="contained" component="label">
                  Insert Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleDisplacementTextureChange}
                  />
                </Button>
                <Button variant="contained" component="label"onClick={() => {
                      component.material.displacementActive = false;
                      component.material.displacementTexture.image = undefined;
                      component.material.displacementTexture.image_path = "";
                      component.material.setNeedsUpdate();
                      setIsControllerChange(!isControllerChange);
                    }}>
                  Remove
                </Button>
              </div>
              )}

              {component instanceof Mesh && component.material instanceof PhongMaterial && (
              <div className="flex flex-col gap-2">
                <div>Normal Texture</div>
                  {(component.material.normalTexture.image && (
                    <div className="flex justify-center mb-2">
                      <img
                        src={component.material.normalTexture.image_path}
                        alt="Current Texture"
                        className="max-w-full max-h-32"
                      />
                    </div>
                  ))
                  ||
                  (
                    <div className="flex justify-center mb-2">
                      No texture loaded
                    </div>
                  )}
                  <Button variant="contained" component="label">
                    Insert Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleNormalTextureChange}
                    />
                  </Button>
                  <Button variant="contained" component="label"onClick={() => {
                        component.material.normalActive = false;
                        component.material.normalTexture.image = undefined;
                        component.material.normalTexture.image_path = "";
                        component.material.setNeedsUpdate();
                        setIsControllerChange(!isControllerChange);
                      }}>
                    Remove
                  </Button>
              </div>
              )}


              {component instanceof Mesh && component.material instanceof PhongMaterial && (
              <div className="flex flex-col gap-2">
                <div>Parallax Texture</div>
                  {(component.material.parallaxTexture.image && (
                    <div className="flex justify-center mb-2">
                      <img
                        src={component.material.parallaxTexture.image_path}
                        alt="Current Texture"
                        className="max-w-full max-h-32"
                      />
                    </div>
                  ))
                  ||
                  (
                    <div className="flex justify-center mb-2">
                      No texture loaded
                    </div>
                  )}
                  <Button variant="contained" component="label">
                    Insert Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleParallaxTextureChange}
                    />
                  </Button>
                  <Button variant="contained" component="label"onClick={() => {
                        component.material.parallaxActive = false;
                        component.material.parallaxTexture.image = undefined;
                        component.material.parallaxTexture.image_path = "";
                        component.material.setNeedsUpdate();
                        setIsControllerChange(!isControllerChange);
                      }}>
                    Remove
                  </Button>
              </div>
              )}

              {component instanceof Mesh && component.material instanceof PhongMaterial && (
              <div className="flex flex-col gap-2">
                <div>Specular Texture</div>
                {(component.material.specularTexture.image && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={component.material.specularTexture.image_path}
                      alt="Current Texture"
                      className="max-w-full max-h-32"
                    />
                  </div>
                ))
                ||
                (
                  <div className="flex justify-center mb-2">
                    No texture loaded
                  </div>
                )}
                <Button variant="contained" component="label">
                  Insert Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleSpecularTextureChange}
                  />
                </Button>
                <Button variant="contained" component="label"onClick={() => {
                      if(component.material instanceof PhongMaterial){
                        component.material.specularTexture.image = undefined;
                        component.material.specularTexture.image_path = "";
                        component.material.setNeedsUpdate();
                        setIsControllerChange(!isControllerChange);
                      }
                    }}>
                  Remove
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
