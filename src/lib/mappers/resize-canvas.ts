import { ResizeOptions } from 'sharp';
import { FastlyCompatError } from '../errors';
import { colorFromParam, regionFromParam } from '../helpers';
import { Mapper } from '../imageopto-types';

const resizeCanvas: Mapper = (sharp, params) => {
  const options = ({
    background: params.has('bg-color')
      ? colorFromParam(params, 'bg-color')
      : 'white',
    fit: 'contain',
    withoutEnlargement: true
  } as unknown) as ResizeOptions;
  const region = regionFromParam(params, 'canvas');
  if (region.left > 0 || region.top > 0) {
    throw new FastlyCompatError(
      params,
      'canvas',
      'pixel-specific canvas offsets'
    );
  }
  const positions: string[] = [];
  if (region.left === 0) {
    positions.push('left');
  }
  if (region.top === 0) {
    positions.push('right');
  }
  if (positions.length > 0) {
    options.position = positions.join(' ');
  }
  return sharp.resize(region.width, region.height, options);
};

export default resizeCanvas;
