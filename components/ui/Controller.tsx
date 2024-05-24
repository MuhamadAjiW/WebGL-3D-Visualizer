import { Euler } from "@/libs/base-types/euler";
import { Quaternion } from "@/libs/base-types/quaternion";
import Vector3 from "@/libs/base-types/vector3";
import { BasicMaterial } from "@/libs/class/material/basic-material";
import { PhongMaterial } from "@/libs/class/material/phong-material";
import { Mesh } from "@/libs/class/mesh";
import Object3D from "@/libs/class/object3d";
import { Texture } from "@/libs/class/texture/texture";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useRef } from "react";
import { Collapse } from "react-collapse";
import { GoChevronDown, GoChevronRight } from "react-icons/go";

interface ControllerProps {
  id: string;
  isExpanded: boolean;
  handleClick: () => void;
  title: string;
  component: Object3D;
  handleSubmit: (values: any) => void;
  isControllerChange: boolean;
}

const ComponentController: React.FC<ControllerProps> = ({
  id,
  isExpanded,
  handleClick,
  title,
  component,
  handleSubmit,
  isControllerChange,
}) => {
  // TODO: setFromQuaternion is a little off here for some reason on the y axis at 90 degrees
  // The quick fix is just to only load it whenever the components reset so uhh
  const savedComponent = useRef<Object3D | null>(null)
  const rotation = useRef<Vector3>(Vector3.zero)
  const position = useRef<Vector3>(Vector3.zero)
  const scale = useRef<Vector3>(Vector3.one)
  const name = useRef<string>("")


  // Texture
  const normalTexture = useRef<Texture | null>(null)
  const parallaxTexture = useRef<Texture | null>(null)
  const diffuseTexture = useRef<Texture | null>(null)
  const specularTexture = useRef<Texture | null>(null)

  if(component && component != savedComponent.current){
    console.log(component)
    savedComponent.current = component;

    const euler = new Euler()
    euler.setFromQuaternion(component.rotation as Quaternion);
    rotation.current = euler.toVector3Degrees();
    position.current = component.position;
    scale.current = component.scale;
    name.current = component.name;

    if (component instanceof Mesh) {
      if (component.material instanceof BasicMaterial) {
        normalTexture.current = component.material.normalTexture;
        parallaxTexture.current = component.material.parallaxTexture;
      } else if (component.material instanceof PhongMaterial) {
        normalTexture.current = component.material.normalTexture;
        parallaxTexture.current = component.material.parallaxTexture;
        diffuseTexture.current = component.material.diffuseTexture;
        specularTexture.current = component.material.specularTexture;
      }
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
      normalTexture: normalTexture.current,
      parallaxTexture: parallaxTexture.current,
      diffuseTexture: diffuseTexture.current,
      specularTexture: specularTexture.current,
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
    enableReinitialize: true,
  });

  const refresh = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    formik.submitForm()
  }

  const handleNormalTextureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target?.result as string;
        const image_path = "res/" + file.name

        if (component instanceof Mesh) {
          component.material.normalTexture.image = image;
          component.material.normalTexture.image_path = image_path;

          normalTexture.current = component.material.normalTexture
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParallaxTextureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target?.result as string;
        const image_path = "res/" + file.name

        if (component instanceof Mesh) {
          component.material.parallaxTexture.image = image;
          component.material.parallaxTexture.image_path = image_path;

          parallaxTexture.current = component.material.parallaxTexture
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiffuseTextureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target?.result as string;
        const image_path = "res/" + file.name

        if (component instanceof Mesh && component.material instanceof PhongMaterial) {
          component.material.diffuseTexture.image = image;
          component.material.diffuseTexture.image_path = image_path;

          diffuseTexture.current = component.material.diffuseTexture
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpecularTextureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target?.result as string;
        const image_path = "res/" + file.name

        if (component instanceof Mesh && component.material instanceof PhongMaterial) {
          component.material.specularTexture.image = image;
          component.material.specularTexture.image_path = image_path;

          specularTexture.current = component.material.specularTexture
        }
      };
      reader.readAsDataURL(file);
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

              // Normal Texture
              <div className="flex flex-col gap-2">
                <div>Normal Texture</div>
                {component instanceof Mesh && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={component.material.normalTexture.image_path}
                      alt="Current Texture"
                      className="max-w-full max-h-32"
                    />
                  </div>
                )}
                {component instanceof Mesh && (
                  <Button variant="contained" component="label">
                    Normal Texture
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleNormalTextureChange}
                    />
                  </Button>
                )}
              </div>

              // Parallax Texture
              <div className="flex flex-col gap-2">
                <div>Parallax Texture</div>
                {component instanceof Mesh && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={component.material.parallaxTexture.image_path}
                      alt="Current Texture"
                      className="max-w-full max-h-32"
                    />
                  </div>
                )}
                {component instanceof Mesh && (
                  <Button variant="contained" component="label">
                    Parallax Texture
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleParallaxTextureChange}
                    />
                  </Button>
                )}
              </div>

              // Diffuse Texture
              <div className="flex flex-col gap-2">
                <div>Diffuse Texture</div>
                {component instanceof Mesh && component.material instanceof BasicMaterial && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={component.material.diffuseTexture.image_path}
                      alt="Current Texture"
                      className="max-w-full max-h-32"
                    />
                  </div>
                )}
                {component instanceof Mesh && component.material instanceof BasicMaterial && (
                  <Button variant="contained" component="label">
                    Diffuse Texture
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleDiffuseTextureChange}
                    />
                  </Button>
                )}
              </div>

              // Specular Texture
              <div className="flex flex-col gap-2">
                <div>Specular Texture</div>
                {component instanceof Mesh && component.material instanceof PhongMaterial && (
                  <div className="flex justify-center mb-2">
                    <img
                      src={component.material.specularTexture.image_path}
                      alt="Current Texture"
                      className="max-w-full max-h-32"
                    />
                  </div>
                )}
                {component instanceof Mesh && component.material instanceof PhongMaterial && (
                  <Button variant="contained" component="label">
                    Specular Texture
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleSpecularTextureChange}
                    />
                  </Button>
                )}
              </div>

            </div>
          </Collapse>
        </div>
      )}
    </>
  );
};

export default ComponentController;
