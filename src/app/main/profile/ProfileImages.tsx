import FusePageSimple from '@fuse/core/FusePageSimple';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState, useCallback} from 'react';
import {UserDTO} from "../../types/UserModel";
import api from "../../services/BackendApi";
import useStyles from "./ProfileImages.css";
import { getCroppedImg, getRotatedImage } from 'app/utils/canvasUtils';
import { getOrientation } from 'get-orientation/browser'

import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider/Slider';
import { blobToFile, readFile } from 'app/utils/utils';
import history from '@history';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const ORIENTATION_TO_ANGLE = {
    '3': 180,
    '6': 90,
    '8': -90,
}

export default function ProfileImages(props:any) {
    const classes1 = useStyles();
    const [imageSrc, setImageSrc] = React.useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const {t} = useTranslation('profile');
    const user = useSelector(({ auth }) => auth.user);
   // const [value, setValue] = React.useState<number | number[]>(1);
    const [progress, setProgress] = React.useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [userInfo, setUserInfo] = useState<UserDTO>({} as UserDTO);
    const [profilSrc, setProfilSrc] = React.useState<any>(null)

    useEffect(() => {
        if(user.role.length>0){
            api.getCurrentUser().then(response => {
                setUserInfo(response);
                if(response.photoURL) {
                    console.log("Profile Image-save")
                    api.getProfilImage(response.photoURL).then(res => {setImageSrc(URL.createObjectURL(res)); });
                }
            });
        }
  }, []);


    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
      }, [])

      const showCroppedImage = useCallback(async () => {
        try {
          const croppedImagee = await getCroppedImg(
            imageSrc,
            croppedAreaPixels,
            rotation
          )

          setCroppedImage(croppedImagee)

       let progressCallback = (loaded: number, total: number) => {
            setProgress(Math.round((loaded / total) * 100))
        };

        api.uploadImagesData(blobToFile(croppedImagee,'resim'), progressCallback).then((data) => {
          console.log(data);
         }).finally(() => {
          history.push("/profile")
           })

        } catch (e) {
          console.error(e)
        }
          //window.location.reload()
          setTimeout(function() { window.location=window.location;},10);
      }, [imageSrc, croppedAreaPixels, rotation]);



      const onClose = useCallback(() => {
        setCroppedImage(null)
      }, [])

      const onFileChange = async e => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          let imageDataUrl = await readFile(file)


          // apply rotation if needed
          const orientation = await getOrientation(file)
          const rotation = ORIENTATION_TO_ANGLE[orientation]
          if (rotation) {
            imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
          }

          setImageSrc(imageDataUrl)
        }
      }
      const handleZoomChange = (event: any, newValue: number | number[]) => {
         setZoom(newValue || newValue[0])
        //setZoom(event.target.value === '' ? 0 : Number(event.target.value));
      };

      const handleRotationChange = (event: any, newValue: number | number[]) => {
        setRotation(newValue || newValue[0])
      };
    return (
        <FusePageSimple
            classes={{
                header: classes1.layoutHeader
            }}
            header={
              <div className="p-24 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
              <div
                  className="flex flex-1 flex-col items-center justify-center md:flex-row md:items-center md:justify-start">


                {userInfo.photoURL ? (
					<Avatar className="w-96 h-96"  src={imageSrc} /> ) : (
					<Avatar className="w-96 h-96"  src="assets/images/avatars/profile.jpg"> </Avatar> )}

                  <Typography
                      className="md:mx-24 text-24 md:text-32 my-8 md:my-0"
                      variant="h4"
                      color="inherit"
                  >
                      {userInfo.name} {userInfo.surname}
                  </Typography>
              </div>
          </div>
            }
            content={
                <div className="p-16">
                 <div>
      {imageSrc ? (
        <React.Fragment>
            <input type="file" onChange={onFileChange} accept="image/*" /> <br/><br/>
          <div className={classes1.cropContainer}>
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={400 / 400}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className={classes1.controls}>
            <div className={classes1.sliderContainer}>
              <Typography
                variant="overline"
                classes={{ root: classes1.sliderLabel }}
              >
                  {t("ZOOM")}
              </Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby={t("ZOOM")}
                onChange={handleZoomChange}
                className={classes1.slider}
              />
            </div>
            <div className={classes1.sliderContainer}>
              <Typography
                variant="overline"
                classes={{ root: classes1.sliderLabel }}
              >
                  {t("ROTATION")}
              </Typography>
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="input-slider"
                onChange={handleRotationChange}
                className={classes1.slider}
              />
            </div>
            <Button
              onClick={showCroppedImage}
              variant="contained"
              color="primary"
              classes={{ root: classes1.cropButton }}
            >
                {t("SAVE")}
            </Button>
          </div>


        </React.Fragment>
      ) : (
        <input type="file" onChange={onFileChange} accept="image/*" />
      )}
    </div>
                </div>
            }
        />
    );
}
