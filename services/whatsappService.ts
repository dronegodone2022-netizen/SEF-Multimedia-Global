export class WhatsAppService {
  static async sendMessage(phone: string, message: string): Promise<boolean> {
    console.info('WhatsApp message requested', { phone, message });
    return true;
  }
}
