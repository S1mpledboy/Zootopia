import { NextResponse } from 'next/server';
import DiscountCode from '@/models/DiscountCode';

export async function POST(request: Request) {
  try {

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ message: 'Nie podano kodu.' }, { status: 400 });
    }

    const discount = await DiscountCode.findOne({ code: code.toUpperCase() });

    if (!discount) {
      return NextResponse.json({ message: 'Kod rabatowy jest nieprawidłowy.' }, { status: 404 });
    }

    if (!discount.isActive) {
      return NextResponse.json({ message: 'Ten kod rabatowy jest już nieaktywny.' }, { status: 400 });
    }

    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return NextResponse.json({ message: 'Ten kod rabatowy wygasł.' }, { status: 400 });
    }

    if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
      return NextResponse.json({ message: 'Limit użyć tego kodu został wyczerpany.' }, { status: 400 });
    }

    return NextResponse.json({
      code: discount.code,
      type: discount.type,
      value: discount.value
    }, { status: 200 });

  } catch (error) {
    console.error("Błąd walidacji kodu:", error);
    return NextResponse.json({ message: 'Wystąpił błąd serwera.' }, { status: 500 });
  }
}