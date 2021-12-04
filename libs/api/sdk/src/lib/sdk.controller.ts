import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common'
import { SdkService } from './sdk.service'
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { NFTForSale, ScopeEnum, SellNFTDto } from '@xact-wallet-sdk/client'

@ApiTags('SDK')
@Controller()
export class SdkController {

  constructor(private readonly service: SdkService) {
  }

  @Get('getQrCode/:socketId')
  @ApiOperation({ description: 'Connect to Xact Wallet' })
  @ApiOkResponse()
  async connect(@Param('socketId') socketId: string): Promise<string> {
    try {
      return await this.service.getQrCode(socketId)
    } catch (e) {
      throw new HttpException({
        error: e,
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('refresh')
  @ApiOperation({ description: 'Get NFTs' })
  @ApiOkResponse()
  listNFT(@Body() opts: { accountId: string, scope?: ScopeEnum[] }): Promise<string> {
    return this.service.refresh(opts)
  }


  @Post('sell-nft')
  @ApiBody({ type: SellNFTDto })
  @ApiOperation({ description: 'Sell a NFT' })
  @ApiOkResponse()
  async sellNFT(@Body() opts: SellNFTDto): Promise<void> {
    try {
      return await this.service.sellNFT(opts)
    } catch (e) {
      console.log('err selling nft', e)
      throw new HttpException({
        error: e,
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Get('nft-for-sale')
  @ApiOperation({ description: 'Get NFT For Sale' })
  @ApiOkResponse()
  async getNFTForSale(@Query('tokenId') tokenId: string): Promise<NFTForSale> {
    try {
      return await this.service.getNFTForSale(tokenId)
    } catch (e) {
      throw new HttpException({
        error: e,
      }, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('delete-nft/:id')
  async removeFromSale(@Param('id') id: string,
                       @Body() opts: { nftIds: Array<string> },
                       @Query('socketId',
                       ) socketId: string): Promise<void> {
    try {
      return await this.service.removeFromSale(id, opts.nftIds, socketId)
    } catch (e) {
      throw new HttpException({
        error: e,
      }, HttpStatus.BAD_REQUEST)
    }
  }


}
